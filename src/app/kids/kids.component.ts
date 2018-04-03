import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.css']
})
export class KidsComponent implements OnInit {
  kids: any;
  queryKids$ = new Subject<string>();

  constructor(public afAuth: AngularFireAuth,
              private db: AngularFirestore) { }

  ngOnInit() {
    // Build query to get my kids
    this.kids = this.queryKids$.switchMap(uid =>
      this.db.collection('/kids', ref => ref.where('parent', '==', uid)).valueChanges()
    );
    // Get my kids
    this.afAuth.authState.subscribe(
      user => {
        this.queryKids$.next(user.uid);
      }
    );
  }

}
