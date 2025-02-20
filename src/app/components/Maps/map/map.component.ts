import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { GeocodingService } from '../../../Services/geocoding.service';

export interface LatLng {
  id: number;
  lat: number;
  lng: number;
  description?: string;
  isDrinkable?: boolean;
  susceptibilityIndex?: number;
  address?: string; // New field for address
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMap],
  template: `
    <google-map
      #map
      height="500px"
      width="100%"
      [center]="center"
      [zoom]="zoom">
    </google-map>
  `,
  styles: [
    `
      google-map {
        display: block;
      }
    `
  ]
})
export class MapComponent implements OnChanges, AfterViewInit {
  @Input() markers: LatLng[] = [];
  @ViewChild('map', { static: false }) map!: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: 39.4529522, lng: -8.0676795}; // Center Portugal
  zoom = 6;

  private googleMapMarkers: google.maps.Marker[] = [];
  private infoWindows: google.maps.InfoWindow[] = [];

  constructor(private router: Router, private geocodingService: GeocodingService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['markers'] && this.markers?.length) {
      this.center = { lat: this.markers[0].lat, lng: this.markers[0].lng };
      this.updateMarkers();
    }
  }

  ngAfterViewInit() {
    this.updateMarkers();
  }

  private updateMarkers() {
    if (!this.map || !this.map.googleMap) return;

    // Remove existing markers
    this.googleMapMarkers.forEach(marker => marker.setMap(null));
    this.googleMapMarkers = [];
    this.infoWindows = [];

    this.markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: this.map.googleMap
      });

      const infoWindow = new google.maps.InfoWindow({
        content: this.generateInfoWindowContent(markerData)
      });

      // Fetch city name and update InfoWindow
      this.geocodingService.reverseGeocode(markerData.lat, markerData.lng).subscribe(city => {
        markerData.address = city;
        infoWindow.setContent(this.generateInfoWindowContent(markerData));
      });

      marker.addListener('click', () => {
        this.infoWindows.forEach(info => info.close());
        infoWindow.open(this.map.googleMap, marker);
      });

      marker.addListener('dblclick', () => {
        this.router.navigate(['/fountain', markerData.id], { state: { fountain: markerData } });
      });

      this.googleMapMarkers.push(marker);
      this.infoWindows.push(infoWindow);
    });
  }

  private generateInfoWindowContent(markerData: LatLng): string {
    return `
      <div class="bg-white rounded-lg text-center">
        <h3 class="text-lg font-semibold text-blue-600">${markerData.description || 'No description available'}</h3>
        <p class="mt-2 text-sm"><span class="font-bold">Drinkable:</span> ${markerData.isDrinkable ? "✅ <span class='text-green-600'>Yes</span>" : "❌ <span class='text-red-600'>No</span>"}</p>
        <p class="text-sm"><span class="font-bold">Susceptibility Index:</span> <span class="text-gray-700">${markerData.susceptibilityIndex}</span></p>
        <p class="text-sm"><span class="font-bold">City:</span> ${markerData.address ? markerData.address : 'Fetching...'}</p>
        <a href="/fountain/${markerData.id}" class="mt-3 inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
          View Details
        </a>
      </div>
    `;
  }
}
