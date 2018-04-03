import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth,
              private router: Router,
              private db: AngularFirestore) {
  }

  ngOnInit() {
    // If user doesn't exists in firestore; save it. Else redirect to the map
    this.afAuth.authState.subscribe(
      user => {
        this.db.collection('/users').doc(user.uid).valueChanges().subscribe(
          userFromDB => {
            if (userFromDB) {
              this.router.navigate(['/map']);
            } else {
              this.db.collection('/users').doc(user.uid).set({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
              });
            }
          }
        );
      }
    );
  }

  loginFacebook() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }

}
