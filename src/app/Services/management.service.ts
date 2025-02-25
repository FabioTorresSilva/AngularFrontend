// management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fountain } from '../Models/fountain';

@Injectable({ providedIn: 'root' })
export class ManagementService {
  private fountainUrl = 'https://localhost:7057/api/fountains';
  private favoritesUrl = 'http://localhost:8080/api/user/favorites';
  private testerUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}


  getUserFavorites(userId: number): Observable<Fountain[]> {
    return this.http.get<Fountain[]>(`${this.favoritesUrl}/${userId}`);
  }

  // ----------------- Fountain Management Functions -----------------

  // Create a new fountain
  createFountain(payload: any): Observable<any> {
    return this.http.post(this.fountainUrl, payload);
  }

  // Search for a fountain by its ID
  searchFountain(fountainId: string): Observable<any> {
    return this.http.get(`${this.fountainUrl}/${fountainId}`);
  }

  // Update an existing fountain (expects fountain.id to be defined)
  updateFountain(fountain: any): Observable<any> {
    return this.http.put(`${this.fountainUrl}/${fountain.id}`, fountain);
  }

  // Delete a fountain by its ID
  deleteFountain(fountain: any): Observable<any> {
    return this.http.delete(`${this.fountainUrl}/${fountain.id}`);
  }

  // ----------------- Tester Management Functions (if needed) -----------------

  getTesters(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/user/role/Tester');
  }

  createTester(payload: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/auth/signup', payload);
  }

  updateTester(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.testerUrl}/${id}`, payload);
  }
}
