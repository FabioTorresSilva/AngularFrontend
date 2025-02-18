import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-heat-map',
  standalone: true,
  imports: [GoogleMap, GoogleMapsModule], // Import GoogleMap module
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.css'],
})
export class HeatMapComponent implements AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  center = { lat: 38.7169, lng: -9.1395 }; // Lisbon as center
  zoom = 6;
  heatmapLayer!: google.maps.visualization.HeatmapLayer;

  // Example heatmap data (latitude, longitude)
  heatmapData: google.maps.LatLngLiteral[] = [
    { lat: 38.7169, lng: -9.1395 }, // Lisbon
    { lat: 41.1496, lng: -8.6109 }, // Porto
    { lat: 37.0194, lng: -7.9304 }, // Faro
    { lat: 40.2089, lng: -8.4295 }, // Coimbra
    { lat: 39.823, lng: -7.4931 }, // Castelo Branco
  ];

  ngAfterViewInit() {
    this.addHeatmapLayer();
  }

  addHeatmapLayer() {
    if (!this.map) return;

    this.heatmapLayer = new google.maps.visualization.HeatmapLayer({
      data: this.heatmapData.map((point) => new google.maps.LatLng(point.lat, point.lng)),
      dissipating: true,
      radius: 50, // Adjust radius for better visibility
      opacity: 0.6,
    });

    this.heatmapLayer.setMap(this.map.googleMap!);
  }
}
