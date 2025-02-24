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

  editingTesterId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.getTesters();
  }

  getTesters(): void {
    const token = this.authService.authToken;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:8080/api/user/role/Tester', { headers })
      .subscribe({
        next: (data) => {
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
          this.successMessage = 'Conta de Tester Criada com sucesso';
          this.testerName = '';
          this.testerEmail = '';
          this.testerPassword = '';
          this.getTesters();
        },
        error: (err) => {
          console.error('Error creating tester account', err);
          this.successMessage = ''; 
        }
      });
  }

  updateTester(tester: any): void {
    const token = this.authService.authToken;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.put(`http://localhost:8080/api/user/${tester.id}`, tester, { headers, responseType: 'text' })
      .subscribe({
        next: (res) => {
          this.successMessage = 'Tester updated successfully';
          this.editingTesterId = null;
          this.getTesters(); 
        },
        error: (err) => {
          console.error('Error updating tester', err);
          this.successMessage = '';
        }
      });
  }

  cancelEdit(): void {
    this.editingTesterId = null;
    this.getTesters();
  }
}
