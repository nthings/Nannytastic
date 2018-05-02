import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { LoaderService } from '../services/loader.service';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/toArray';

@Component({
  selector: 'app-nanny-details',
  templateUrl: './nanny-details.component.html',
  styleUrls: ['./nanny-details.component.css']
})
export class NannyDetailsComponent implements OnInit {
  nanny;
  nannyAsync;
  reviews;
  stars;
  remainingStars;
  categories;
  queryNannys$ = new Subject<string>();
  queryReviews$ = new Subject<string>();
  constructor(private db: AngularFirestore,
              private loaderService: LoaderService,
              private cdr: ChangeDetectorRef,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.loaderService.showLoader();

    // Queries
    this.nannyAsync = this.queryNannys$.switchMap(name =>
      this.db.collection('/nannys', ref => ref.where('name', '==', name)).snapshotChanges()
        .map(changes => {
          return changes.map(change => {
            const data = change.payload.doc.data();
            const id = change.payload.doc.id;
            return { id, ...data };
          });
        })
    );
    this.reviews = this.queryReviews$.switchMap(nanny =>
      this.db.collection('/reviews', ref => ref.where('nanny', '==', nanny)).snapshotChanges()
        .map(changes => {
          return changes.map(change => {
            const data = change.payload.doc.data();
            return data;
          });
        })
    );

    this.reviews.subscribe(reviews => console.log(reviews));

    // Subscriptions to the queries
    this.nannyAsync.subscribe(
      nanny => {
        this.nanny = nanny[0];
        this.queryReviews$.next(this.nanny.id);
        this.stars = Observable.range(0, this.nanny.stars).toArray();
        this.remainingStars = Observable.range(0, 5 - this.nanny.stars).toArray();
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
            this.loaderService.hideLoader();
          }
        );
      }
    );

    this.queryNannys$.next(this.route.snapshot.paramMap.get('name'));
  }

}
