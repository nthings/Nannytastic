import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-img-cropper';
import { WebCamModule } from 'ack-angular-webcam';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NannyInfoWindowComponent } from './nanny-info-window/nanny-info-window.component';
import { KidsComponent } from './kids/kids.component';
import { LoadingComponent } from './loading/loading.component';
import { KidsDialogComponent } from './dialogs/kids.dialog/kids.dialog.component';

import { LoaderService } from './services/loader.service';
import { NannyDetailsComponent } from './nanny-details/nanny-details.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MapComponent,
    NavbarComponent,
    NannyInfoWindowComponent,
    KidsComponent,
    LoadingComponent,
    KidsDialogComponent,
    NannyDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    routes,
    ImageCropperModule,
    WebCamModule,
    NgbModule.forRoot(),
    DeviceDetectorModule.forRoot()
  ],
  providers: [LoaderService],
  bootstrap: [AppComponent],
  entryComponents: [NannyInfoWindowComponent, KidsDialogComponent]
})
export class AppModule { }
