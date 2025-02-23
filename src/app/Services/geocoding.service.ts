import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environement';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(private http: HttpClient) { }

  reverseGeocode(lat: number, lon: number): Observable<string> {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${environment.opencageApiKey}`;
    console.log("Requesting URL: ", url);

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.results && response.results.length > 0) {
          const components = response.results[0].components;
          return components.city || components.town || components.village || components.county || 'Unknown';
        } else {
          return 'Unknown';
        }
      })
    );
  }
}
