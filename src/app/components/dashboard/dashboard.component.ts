import { Component } from '@angular/core';
import { TestermanagementComponent } from './testermanagement/testermanagement.component';
import { FountainmanagementComponent } from './fountainmanagement/fountainmanagement.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, FountainmanagementComponent, TestermanagementComponent],
    templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedMenu: string = 'fountains';
}
