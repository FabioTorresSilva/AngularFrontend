import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapComponent, LatLng } from '../Maps/map/map.component';
import { FountainService } from '../../Services/fountain.service';
import { AuthService } from '../../Services/auth.service';
import { catchError, Observable, Subscription, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Fountain } from '../../Models/fountain';
import { RadonInfoComponent } from "./radon-info/radon-info.component";
import { environment } from '../../../environments/environement';

interface City {
  name: string;
  center: google.maps.LatLngLiteral;
}

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [MapComponent, CommonModule, RouterModule, RadonInfoComponent],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit, OnDestroy {
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  locations: LatLng[] = [];
  filteredLocations: LatLng[] = [];
  favorites: Fountain[] = [];
  cities: City[] = [];
  isUserLoggedIn: boolean = false;
  center: google.maps.LatLngLiteral = { lat: 39.4529522, lng: -8.0676795 };
  zoom: number = 6;
  
  private authSubscription!: Subscription;

  constructor(
    private fountainService: FountainService,
    private authService: AuthService,
    private http: HttpClient,
    public router: Router
  ) { }

  ngOnInit() {
    this.http.get<City[]>('assets/portuguese-cities.json').subscribe(
      data => {
        this.cities = data;
      },
      error => {
        console.error('Error loading cities JSON:', error);
      }
    );

    // Existing initialization code for fetching locations and favorites...
    this.authSubscription = this.authService.user.subscribe(user => {
      this.isUserLoggedIn = !!user;
      if (user && user.id) {
        this.fountainService.getXFavourites(user.id, 3).subscribe({
          next: (favData: Fountain[]) => {
            this.favorites = favData;
            console.log('User favorites:', this.favorites);
          },
          error: (err) => {
            console.error('Error fetching favorites:', err);
          }
        });
      }
    });

    this.fountainService.getFountains().subscribe({
      next: (data: LatLng[]) => {
        console.log('Received fountain data in BodyComponent:', data);
        this.locations = data;
        this.filteredLocations = data;
      },
      error: (error) => {
        console.error('Error fetching fountain data:', error);
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  toggleFavorite(fountain: Fountain): void {
    // Assuming your AuthService holds the current user details
    const currentUser = this.authService.currentUser; // or however you access the current user
    if (!currentUser) {
      console.error('User not logged in.');
      return;
    }
    
    this.fountainService.toggleFavorite(currentUser.id, fountain.id).subscribe({
      next: (result: Fountain) => {
        console.log('Favorite toggled successfully', result);
        this.fountainService.getXFavourites(currentUser.id, 3).subscribe({
          next: (favData: Fountain[]) => {
            this.favorites = favData;
          },
          error: err => console.error('Error refreshing favorites:', err)
        });
      },
      error: (err) => {
        console.error('Error toggling favorite:', err);
      }
    });
  }

  zoomNearMe(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation: google.maps.LatLngLiteral = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.mapComponent.updateView(userLocation, 15);
        },
        (error) => {
          console.error('Error getting location', error);
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }
  

  onCitySelect(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'todos') {
      this.mapComponent.updateView(this.center, this.zoom);
    } else {
      const selectedCity = this.cities.find(city => city.name === selectedValue);
      if (selectedCity) {
        this.mapComponent.updateView(selectedCity.center, 12);
      }
    }
  }

}
