import { Routes } from '@angular/router';

import { AuthGuard } from './Guards/auth.guard';
import { LoginComponent } from './components/Auth/login/login.component';
import { SignUpComponent } from './components/Auth/signup/signup.component';
import { BodyComponent } from './components/body/body.component';
import { FountainDetailComponent } from './components/fountaindetail/fountaindetail.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { TesterComponent } from './components/tester/tester.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


export const routes: Routes = [
    { path: '', component: BodyComponent },
    { path: 'fountain/:id', component: FountainDetailComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'tester', component: TesterComponent, canActivate: [AuthGuard] },
    { path: 'sign-in', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'favourites', component: FavouritesComponent }, 
    { path: '**', redirectTo: '/' }
];


