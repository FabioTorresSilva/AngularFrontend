import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']  
})
export class DashboardComponent implements OnInit {
  selectedMenu: string = 'testers';
  testers: any[] = [];

  testerName: string = '';
  testerEmail: string = '';
  testerPassword: string = '';
  successMessage: string = ''; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.getTesters();
  }

  getTesters(): void {
    const token = this.authService.authToken;
    console.log('Token from authService:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:8080/api/user/role/Tester', { headers })
      .subscribe({
        next: (data) => {
          console.log('Fetched testers:', data);
          this.testers = data;
        },
        error: (err) => {
          console.error('Error fetching testers:', err);
        }
      });
  }

  createTester(): void {
    const payload = {
      name: this.testerName,
      email: this.testerEmail,
      password: this.testerPassword,
      role: 1
    };

    this.http.post('http://localhost:8080/api/auth/signup', payload, { responseType: 'text' })
      .subscribe({
        next: (res: string) => {
          console.log('Tester account created successfully', res);
          this.successMessage = 'Tester account created successfully!';
          // Clear the form fields
          this.testerName = '';
          this.testerEmail = '';
          this.testerPassword = '';
          // Refresh tester list
          this.getTesters();
        },
        error: (err) => {
          console.error('Error creating tester account', err);
          this.successMessage = ''; // Optionally handle error message here
        }
      });
  }
}
