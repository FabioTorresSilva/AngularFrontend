import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { GeocodingService } from '../../../Services/geocoding.service';
import { AuthService } from '../../../Services/auth.service';

export interface LatLng {
  id: number;
  lat: number;
  lng: number;
  continuousUseDeviceId?: number;
  description?: string;
  isDrinkable?: boolean;
  susceptibilityIndex?: any;
  address?: string;
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

  center: google.maps.LatLngLiteral = { lat: 39.4529522, lng: -8.0676795 }; 
  zoom = 6;

  private googleMapMarkers: google.maps.Marker[] = [];
  private infoWindows: google.maps.InfoWindow[] = [];

  constructor(private router: Router, private geocodingService: GeocodingService, private authService: AuthService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['markers'] && this.markers?.length) {
      this.center = { lat: this.markers[0].lat, lng: this.markers[0].lng };
      this.updateMarkers(this.markers);
    }
  }

  ngAfterViewInit() {
    this.updateMarkers(this.markers);
  }

  public updateView(center: google.maps.LatLngLiteral, zoom: number): void {
    if (this.map && this.map.googleMap) {
      this.map.googleMap.setCenter(center);
      this.map.googleMap.setZoom(zoom);
    }
  }
  
  // Updated to accept a list of markers
  private updateMarkers(markersToShow: LatLng[]) {
    if (!this.map || !this.map.googleMap) return;

    // Remove existing markers
    this.googleMapMarkers.forEach(marker => marker.setMap(null));
    this.googleMapMarkers = [];
    this.infoWindows = [];

    markersToShow.forEach(markerData => {
      const iconUrl = markerData.isDrinkable
        ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
        : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';

      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: this.map.googleMap,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(15, 15)
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: this.generateInfoWindowContent(markerData)
      });


      marker.addListener('click', () => {
        this.infoWindows.forEach(info => info.close());
        infoWindow.open(this.map.googleMap, marker);

        if (!markerData.address) {
          this.geocodingService.reverseGeocode(markerData.lat, markerData.lng)
            .subscribe((cityName: string | undefined) => {
              markerData.address = cityName;
              infoWindow.setContent(this.generateInfoWindowContent(markerData));
              infoWindow.close();
              infoWindow.open(this.map.googleMap, marker);
            }, (error: any) => {
              console.error("Geocoding error:", error);
            });
        }
      });

      marker.addListener('dblclick', () => {
        const subscription = this.authService.user.subscribe(user => {
          if (user) {
            this.router.navigate(['/fountain', markerData.id]).then(() => {
              window.location.reload();
            });
          } 
          subscription.unsubscribe();
        });
      });

      this.googleMapMarkers.push(marker);
      this.infoWindows.push(infoWindow);
    });
  }

  private generateInfoWindowContent(markerData: LatLng): string {
    return `
      <div class="bg-white rounded-lg text-center">
        <h3 class="text-lg font-semibold text-blue-600">${markerData.description || 'No description available'}</h3>
        <p class="mt-2 text-sm"><span class="font-bold"></span> ${markerData.isDrinkable ? "✅ <span class='text-green-600'>Potável</span>" : "❌ <span class='text-red-600'>Não Potável</span>"}</p>
<p class="text-sm">
    <span class="font-bold">Índice Radão: </span>
    <span class="text-gray-700">
      ${ markerData.susceptibilityIndex === "Moderate"
          ? "Moderado" 
          : (markerData.susceptibilityIndex === "Low"? "Baixo" : "Alto") }
    </span>
  </p>
        <p class="text-sm"><span class="font-bold">Cidade:</span> ${markerData.address ? markerData.address : 'Fetching...'}</p>
      </div>
    `;
  }
}