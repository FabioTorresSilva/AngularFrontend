import { Routes } from '@angular/router';

import { authGuard } from './Guards/auth.guard';
import { LoginComponent } from './components/Auth/login/login.component';
import { SignUpComponent } from './components/Auth/signup/signup.component';
import { BodyComponent } from './components/body/body.component';
import { FountainDetailComponent } from './components/fountaindetail/fountaindetail.component';


export const routes: Routes = [
    { path: '', component: BodyComponent },
    { path: 'fountain/:id', component: FountainDetailComponent },
    { path: 'sign-in', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
];


