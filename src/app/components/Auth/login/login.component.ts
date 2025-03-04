import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        console.log('Logged in successfully:', user);
        let redirectUrl = '/'; 
        if (user.role && user.role.toLowerCase() === 'manager') {
          redirectUrl = '/dashboard';
        } else if (user.role && user.role.toLowerCase() === 'tester') {
          redirectUrl = '/tester';
        }
        this.router.navigate([redirectUrl]).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        this.errorMessage = 'Invalid email or password. Try again.';
        console.error('Login error:', error);
      }
    });
  }
}