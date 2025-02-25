import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { LatLng } from '../components/Maps/map/map.component';
import { Fountain } from '../Models/fountain';
import { environment } from '../../environments/environement';
import { AuthService } from './auth.service';
import { WaterAnalysis } from '../Models/wateranalysis';

interface ApiFountain {
  id: number;
  description: string;
  susceptibilityIndex: number;
  continuousUseDeviceId: number;
  isDrinkable: boolean;
  latitude: number;
  longitude: number;
}
export interface AnalysisData {
  totalTests: number;
  lowestRadonValue: number;
  lowestRadonFountain: string;
  highestRadonValue: number;
  highestRadonFountain: string;
  drinkablePercentage: number;
}

export interface WaterAnalysisPayload {
  radonConcentration: number;
  fountainId: number;
  date: string;
  deviceId: number;
}

export interface NormalDevicePayload {
  model: string;
  serialNumber: string;
  expirationDate: string; 
}

export interface ContinuousDevicePayload extends NormalDevicePayload {
  analysisFrequency: number;
  lastAnalysisDate: string; 
}

@Injectable({
  providedIn: 'root'
})
export class FountainService {
  private analysisUrl = 'http://localhost:8080/api/wateranalysis/favorites/analysis';
  private apiUrl = `${environment.apiBaseUrl}/fountains`;
  private dotnetUrl = `${environment.dotnetUrl}/fountains`;
  private waterAnalysisUrl = 'http://localhost:8080/api/wateranalysis';
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.authToken;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createNormalDevice(device: NormalDevicePayload): Observable<any> {
    const url = `${environment.apiBaseUrl}/devices`;
    return this.http.post(url, device);
  }
  
  // Endpoint for continuous use devices (e.g., http://localhost:8080/api/continuousUseDevice)
  createContinuousDevice(device: ContinuousDevicePayload): Observable<any> {
    const url = `${environment.apiBaseUrl}/continuousUseDevice`;
    return this.http.post(url, device);
  }

  getFavoritesAnalysis(favoriteFountainIds: number[]): Observable<AnalysisData> {
    const body = { favoriteFountainIds: favoriteFountainIds };
    return this.http.post<AnalysisData>(this.analysisUrl, body);
  }

  associateWaterAnalysis(userId: number, waterAnalysisId: number): Observable<any> {
    const url = `http://localhost:8080/api/user/addwaterAnalysis/${userId}/${waterAnalysisId}`;
    return this.http.post<any>(url, null); 
  }

  toggleFavorite(userId: number, fountainId: number): Observable<Fountain> {
    const url = `${environment.apiBaseUrl}/user/addfavorite/${userId}/${fountainId}`;
    return this.http.post<Fountain>(url, null, { headers: this.getAuthHeaders() }).pipe(
      tap(response => console.log('Toggle favorite response:', response)),
      catchError(error => {
        console.error('Error toggling favorite:', error);
        return throwError(() => new Error(error.message || 'An error occurred'));
      })
    );
  }

  createWaterAnalysis(analysis: WaterAnalysisPayload): Observable<any> {
    return this.http.post<any>(this.waterAnalysisUrl, analysis);
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

  getWaterAnalysisByFountainId(fountainId: number): Observable<WaterAnalysis[]> {
    const params = new HttpParams().set('count', '10');
    return this.http.get<WaterAnalysis[]>(`${this.dotnetUrl}/${fountainId}/water-analysis`, { params });
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
    const url = `${environment.apiBaseUrl}/user/favorites/${userId}`;
    return this.http.get<Fountain[]>(url, { headers: this.getAuthHeaders() }).pipe(
      tap(data => console.log('User favorites:', data)),
      catchError(error => {
        console.error('Error fetching favorites:', error);
        return throwError(() => new Error(error.message || 'An error occurred'));
      })
    );
  }
}