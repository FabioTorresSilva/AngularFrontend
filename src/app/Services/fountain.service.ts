import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { LatLng } from '../components/Maps/map/map.component';
import { Fountain } from '../Models/fountain';
import { environment } from '../../environments/environement';

interface ApiFountain {
  id: number;
  description: string;
  susceptibilityIndex: number;
  continuousUseDeviceId: number;
  isDrinkable: boolean;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class FountainService {
  // Base URL for fountains endpoints
  private apiUrl = `${environment.apiBaseUrl}/fountains`;

  constructor(private http: HttpClient) {}

  getFountains(): Observable<LatLng[]> {
    return this.http.get<ApiFountain[]>(this.apiUrl).pipe(
      tap(data => console.log('Raw API response:', data, environment.apiBaseUrl)),
      map(fountains =>
        fountains.map(f => ({
          id: f.id,
          lat: f.latitude,
          lng: f.longitude,
          description: f.description,
          isDrinkable: f.isDrinkable,
          susceptibilityIndex: f.susceptibilityIndex,
          continuousUseDeviceId: f.continuousUseDeviceId,
          address: '' // to be populated via reverse geocoding
        }))
      ),
      tap(mapped => console.log('Mapped fountains:', mapped)),
      catchError(error => {
        console.error('Error in FountainService:', error);
        return throwError(() => new Error(error.message || 'An error occurred'));
      })
    );
  }

  getFountainById(id: number): Observable<LatLng> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ApiFountain>(url).pipe(
      tap(data => console.log('Raw API fountain detail:', data, url)),
      map(f => ({
        id: f.id,
        lat: f.latitude,
        lng: f.longitude,
        description: f.description,
        isDrinkable: f.isDrinkable,
        susceptibilityIndex: f.susceptibilityIndex,
        continuousUseDeviceId: f.continuousUseDeviceId,
        address: ''
      })),
      catchError(error => {
        console.error('Error fetching fountain by id:', error);
        return throwError(() => new Error(error.message || 'An error occurred'));
      })
    );
  }
  
  getXFavourites(userId: number, count: number): Observable<Fountain[]> {
    // Assumes your endpoint for favorites is under /favorites/{userId}/{count}
    const url = `${this.apiUrl}/favorites/${userId}/${count}`;
    return this.http.get<Fountain[]>(url).pipe(
      tap(data => console.log('Favorites:', data)),
      catchError(error => {
        console.error('Error fetching favorites:', error);
        return throwError(() => new Error(error.message || 'An error occurred'));
      })
    );
  }
  getUserFavourites(userId: number): Observable<Fountain[]> {
    const url = `${environment.apiBaseUrl}/favorites/${userId}`;
    return this.http.get<Fountain[]>(url).pipe(
      tap(data => console.log('User favorites:', data)),
      catchError(error => {
        console.error('Error fetching favorites:', error);
        return throwError(() => new Error(error.message || 'An error occurred'));
      })
    );
  }
}
