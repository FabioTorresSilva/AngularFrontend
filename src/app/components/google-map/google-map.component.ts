import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [GoogleMapsModule],  // Import GoogleMapsModule here
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css'],
})
export class GoogleMapComponent {
  center = { lat: 38.7169, lng: -9.1395 }; // Example coordinates (San Francisco)
  zoom = 20;
  markerPositions: { lat: number; lng: number; label: string }[] = [
    { lat: 38.7169, lng: -9.1395, label: 'Lisbon' },   // Lisbon
    { lat: 41.1496, lng: -8.6109, label: 'Porto' },     // Porto
    { lat: 38.742, lng: -9.1935, label: 'Sintra' },     // Sintra
  ];
}
