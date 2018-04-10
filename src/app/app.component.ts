import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: Observable<firebase.User>;
  showLoader;

  constructor(public afAuth: AngularFireAuth,
              private loaderService: LoaderService) {
    this.loaderService.loaderShouldShow().subscribe(
      loaderShouldShow => {
        this.showLoader = loaderShouldShow;
      }
    );
    this.user = this.afAuth.authState;
    this.user.subscribe(
      user => {
        console.log(user);
      }
    );
  }
}
