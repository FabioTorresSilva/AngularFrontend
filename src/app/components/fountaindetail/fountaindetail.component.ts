// fountaindetail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FountainStreetViewComponent } from '../Maps/fountain-street-view/fountain-street-view.component';
import { FountainService } from '../../Services/fountain.service'; // your service for fountain details
import { Fountain } from '../../Models/fountain';
import { GeocodingService } from '../../Services/geocoding.service';
import { WaterAnalysis } from '../../Models/wateranalysis';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions, defaultChartOptions } from './chartOptions';
import { AuthService } from '../../Services/auth.service';
import { ManagementService } from '../../Services/management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fountain-detail',
  standalone: true,
  imports: [CommonModule, FountainStreetViewComponent, NgApexchartsModule],
  templateUrl: './fountaindetail.component.html',
  styleUrls: ['./fountaindetail.component.css']
})
export class FountainDetailComponent implements OnInit {
  fountain: Fountain | null = null;
  loadingAddress: boolean = false;
  waterAnalysis: WaterAnalysis[] = [];
  public chartOptions: ChartOptions = defaultChartOptions;

  // New properties for handling favorites
  isFavourite: boolean = false;
  userFavourites: Fountain[] = [];

  private authSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fountainService: FountainService,
    private geocodingService: GeocodingService,
    private authService: AuthService,
    private managementService: ManagementService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fountainService.getFountainById(+id).subscribe(fountainData => {
          this.fountain = fountainData;
          if (this.fountain) {
            this.fountainService.getWaterAnalysisByFountainId(+id)
              .subscribe(
                analysisData => {
                  this.waterAnalysis = analysisData;
                  this.initializeChart();
                },
                error => console.error('Error fetching water analysis:', error)
              );
            if (!this.fountain.address || this.fountain.address === '') {
              this.loadingAddress = true;
              this.geocodingService.reverseGeocode(this.fountain.lat, this.fountain.lng)
                .subscribe(
                  address => {
                    this.fountain!.address = address;
                    this.loadingAddress = false;
                  },
                  error => {
                    console.error('Error fetching address:', error);
                    this.loadingAddress = false;
                  }
                );
            }
            // Fetch user's favorites using the endpoint http://localhost:8080/api/user/favorites/{userId}
            const currentUser = this.authService.currentUser;
            if (currentUser) {
              this.managementService.getUserFavorites(currentUser.id).subscribe({
                next: (favData: Fountain[]) => {
                  this.userFavourites = favData;
                  this.isFavourite = favData.some(fav => fav.id === this.fountain!.id);
                },
                error: (err) => console.error('Error fetching favourites:', err)
              });
            }
          }
        });
      }
    });
  }

  initializeChart(): void {
    const dates = this.waterAnalysis.map(wa => new Date(wa.date).toLocaleDateString());
    const radonValues = this.waterAnalysis.map(wa => wa.radonConcentration);
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: 'Concentração Radão',
          data: radonValues
        }
      ],
      xaxis: {
        categories: dates
      }
    };
  }

  toggleFavourite(): void {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !this.fountain) {
      console.error('User not logged in or fountain not loaded.');
      return;
    }
    // Toggle favourite status using your existing method (or create one if needed)
    this.fountainService.toggleFavorite(currentUser.id, this.fountain.id).subscribe({
      next: (result: Fountain) => {
        // Toggle the local state; or re-fetch the favorites if needed.
        this.isFavourite = !this.isFavourite;
      },
      error: (err) => console.error('Error toggling favourite:', err)
    });
  }
}
