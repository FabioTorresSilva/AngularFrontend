import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) {}

  reverseGeocode(lat: number, lon: number): Observable<string> {
    return this.http.get<any>(this.apiUrl, {
      params: {
        lat: lat.toString(),
        lon: lon.toString(),
        format: 'json'
      }
    }).pipe(
      map(response => {
        // Extract city, town, or village (as they can vary)
        return response.address.city || response.address.town || response.address.village || 'Unknown';
      })
    );
  }
}
