import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
export const firebaseConfig = {
  apiKey: 'AIzaSyAtCXgCkB9PtC3Omx3D3eZVY5bxuPrGXdU',
  authDomain: 'nannytastic-198821.firebaseapp.com',
  databaseURL: 'https://nannytastic-198821.firebaseio.com',
  projectId: 'nannytastic-198821',
  storageBucket: 'nannytastic-198821.appspot.com',
  messagingSenderId: '1087214681331'
};

import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MapComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
