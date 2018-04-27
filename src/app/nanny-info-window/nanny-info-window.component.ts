import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/toArray';

@Component({
  selector: 'app-nanny-info-window',
  templateUrl: './nanny-info-window.component.html',
  styleUrls: ['./nanny-info-window.component.css']
})
export class NannyInfoWindowComponent implements OnInit {
  @Input()
  nanny;

  stars;
  categories;

  constructor(private db: AngularFirestore,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.stars = Observable.range(0, this.nanny.stars).toArray();
    this.db.collection('/categories').valueChanges().subscribe(
      categories => {
        const temp = [];
        for (const category of this.nanny.categories) {
          const index = categories.map((obj) => (<any>obj).value).indexOf(category);
          if (index > -1) {
            temp.push(categories[index]);
          }
        }
        this.categories = temp;
        this.cdr.detectChanges();
      }
    );
  }
}
