import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environement';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [FormsModule, RouterModule, CommonModule
  ],
  standalone:true
})
export class SignUpComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  signUp() {
    if (this.name && this.email && this.password) {
      const userData = { name: this.name, email: this.email, password: this.password };

      this.http.post(`${environment.apiBaseUrl}/user/signup`, userData).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.router.navigate(['/sign-in']);
        },
        error: (err) => {
          console.error('Error during signup', err);
          this.errorMessage = 'Signup failed. Please try again later.';
        }
      });
    } else {
      this.errorMessage = 'All fields are required.';
    }
  }
}
