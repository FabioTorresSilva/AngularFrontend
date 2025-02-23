import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environement';

@Component({
  selector: 'app-fountain-street-view',
  standalone: true,
  imports: [],
  templateUrl: './fountain-street-view.component.html',
  styleUrl: './fountain-street-view.component.css'
})
export class FountainStreetViewComponent implements OnInit {
  @Input() lat!: number;
  @Input() lng!: number;
  streetViewUrl: string = '';

  ngOnInit() {
    // Parameters for the Street View image. Adjust size, fov, heading, and pitch as needed.
    const size = '600x300';
    const fov = 190;
    const heading = 70;
    const pitch = 0;
    const apiKey = environment.googleApiKey// Use your Google API key (ensure Street View Static API is enabled)

    this.streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${this.lat},${this.lng}&fov=${fov}&heading=${heading}&pitch=${pitch}&key=${apiKey}`;
    console.log(this.streetViewUrl)
  }

  onImageError() {
    // Set a default fallback image if Street View is not available.
    this.streetViewUrl = 'assets/Logo.png';
  }
}