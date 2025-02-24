import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { LatLng } from '../components/Maps/map/map.component';
import { Fountain } from '../Models/fountain';
import { environment } from '../../environments/environement';
import { AuthService } from './auth.service';

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
  private apiUrl = `${environment.apiBaseUrl}/fountains`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.authToken;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

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
          address: '' // gets populated by geocoding
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
    const url = `${environment.apiBaseUrl}/user/favorites/${userId}/${count}`;
    return this.http.get<Fountain[]>(url, { headers: this.getAuthHeaders() }).pipe(
      tap(data => console.log('Favorites:', data)),
      catchError(error => {
        console.error('Error fetching favorites:', error);
        return throwError(() => new Error(error.message || 'An error occurred'));
      })
    );
  }
  
  getUserFavourites(userId: number): Observable<Fountain[]> {
    const url = `${environment.apiBaseUrl}/favorites/${userId}`;
    return this.http.get<Fountain[]>(url, { headers: this.getAuthHeaders() }).pipe(
      tap(data => console.log('User favorites:', data)),
      catchError(error => {
        console.error('Error fetching favorites:', error);
        return throwError(() => new Error(error.message || 'An error occurred'));
      })
    );
  }
}