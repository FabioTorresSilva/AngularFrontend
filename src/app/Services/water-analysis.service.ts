import { Injectable } from '@angular/core';
import { environment } from '../../environments/environement';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WaterAnalysis } from '../Models/wateranalysis';


@Injectable({
  providedIn: 'root'
})

export class WaterAnalysisService {
  private apiUrl = `${environment.dotnetUrl}/wateranalysis`;
  private latestAnalysisUrl = `${environment.apiBaseUrl}/user/analysis`;
  
  constructor(private http: HttpClient) { }

  addWaterAnalysis(waterAnalysis: WaterAnalysis): Observable<WaterAnalysis> {
    return this.http.post<WaterAnalysis>(this.apiUrl, waterAnalysis);
  }

  getUserAnalysis(userId: number): Observable<WaterAnalysis[]> {
    const url = `${this.latestAnalysisUrl}/${userId}`;
    return this.http.get<WaterAnalysis[]>(url);
  }
}

