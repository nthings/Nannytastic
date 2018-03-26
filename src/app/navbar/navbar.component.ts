import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user;
  constructor(public afAuth: AngularFireAuth,
              private router: Router) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(
      user => {
        this.user = user;
      }
    );
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

}
