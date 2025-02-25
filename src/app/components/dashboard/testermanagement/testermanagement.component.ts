// testermanagement.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagementService } from '../../../Services/management.service';

@Component({
  selector: 'app-testermanagement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './testermanagement.component.html',
  styleUrls: ['./testermanagement.component.css']
})
export class TestermanagementComponent implements OnInit {
  testers: any[] = [];
  successMessage: string = '';
  testerName: string = '';
  testerEmail: string = '';
  testerPassword: string = '';
  editingTesterId: number | null = null;

  constructor(private managementService: ManagementService) {}

  ngOnInit(): void {
    this.loadTesters();
  }

  loadTesters(): void {
    this.managementService.getTesters().subscribe({
      next: (data) => this.testers = data,
      error: (err) => console.error('Error fetching testers:', err)
    });
  }

  createTester(): void {
    const payload = {
      name: this.testerName,
      email: this.testerEmail,
      password: this.testerPassword,
      role: 1
    };
    this.managementService.createTester(payload).subscribe({
      next: (res: string) => {
        this.successMessage = 'Tester account created successfully';
        this.testerName = '';
        this.testerEmail = '';
        this.testerPassword = '';
        this.loadTesters();
      },
      error: (err) => {
        console.error('Error creating tester:', err);
        this.successMessage = '';
      }
    });
  }

  updateTester(tester: any): void {
    // Build a payload that only contains the fields expected by your backend
    const payload = { 
      name: tester.name, 
      email: tester.email 
    };
  
    this.managementService.updateTester(tester.id, payload).subscribe({
      next: (res: any) => {
        this.successMessage = 'Tester updated successfully';
        this.editingTesterId = null;
        this.loadTesters();
      },
      error: (err) => {
        console.error('Error updating tester:', err);
        this.successMessage = '';
      }
    });
  }

  cancelEdit(): void {
    this.editingTesterId = null;
    this.loadTesters();
  }
}
