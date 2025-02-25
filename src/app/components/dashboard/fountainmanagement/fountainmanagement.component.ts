import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagementService } from '../../../Services/management.service';

@Component({
  selector: 'app-fountainmanagement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fountainmanagement.component.html',
  styleUrls: ['./fountainmanagement.component.css']
})
export class FountainmanagementComponent {
  // Properties for fountain creation
  newFountain: {
    description: string;
    susceptibilityIndex: number;
    continuousUseDeviceId: string | null;
    isDrinkable: boolean;
    latitude: number;
    longitude: number;
  } = {
    description: '',
    susceptibilityIndex: 0,
    continuousUseDeviceId: '', 
    isDrinkable: false,
    latitude: 0,
    longitude: 0
  };
  createSuccessMessage: string = '';

  // Properties for search and list management
  fountainSearchId: string = '';
  fountains: any[] = [];
  successMessage: string = '';
  editingFountainId: number | null = null;

  constructor(private managementService: ManagementService) {}

  createFountain(): void {
    const payload = { ...this.newFountain };
    // If continuousUseDeviceId is empty, send it as null
    if (!payload.continuousUseDeviceId) {
      payload.continuousUseDeviceId = null;
    }

    this.managementService.createFountain(payload).subscribe({
      next: (res: any) => {
        this.createSuccessMessage = 'Fountain created successfully';
        // Reset the form
        this.newFountain = {
          description: '',
          susceptibilityIndex: 0,
          continuousUseDeviceId: '',
          isDrinkable: false,
          latitude: 0,
          longitude: 0
        };
      },
      error: (err: any) => {
        console.error('Error creating fountain:', err);
        this.createSuccessMessage = '';
      }
    });
  }

  searchFountain(): void {
    if (this.fountainSearchId) {
      this.managementService.searchFountain(this.fountainSearchId).subscribe({
        next: (data) => this.fountains = [data],
        error: (err) => {
          console.error('Error fetching fountain:', err);
          this.fountains = [];
        }
      });
    }
  }

  updateFountain(fountain: any): void {
    this.managementService.updateFountain(fountain).subscribe({
      next: (res: any) => {
        this.successMessage = 'Fountain updated successfully';
        this.editingFountainId = null;
        this.searchFountain(); // Refresh data after update
      },
      error: (err: any) => {
        console.error('Error updating fountain:', err);
        this.successMessage = '';
      }
    });
  }

  deleteFountain(fountain: any): void {
    this.managementService.deleteFountain(fountain).subscribe({
      next: (res: any) => {
        this.successMessage = 'Fountain deleted successfully';
        this.fountains = this.fountains.filter(f => f.id !== fountain.id);
      },
      error: (err: any) => {
        console.error('Error deleting fountain:', err);
        this.successMessage = '';
      }
    });
  }

  cancelFountainEdit(): void {
    this.editingFountainId = null;
    this.searchFountain();
  }
}
