import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user;
  constructor(public afAuth: AngularFireAuth,
              private location: Location) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(
      user => {
        this.user = user;
      }
    );
  }

  logout() {
    this.afAuth.auth.signOut();
    this.location.go('/');
    window.location.reload();
  }

}
