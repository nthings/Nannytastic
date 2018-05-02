import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { NannyDetailsComponent } from './nanny-details/nanny-details.component';

export const router: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'map', component: MapComponent},
    { path: 'nanny/:name', component: NannyDetailsComponent}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
