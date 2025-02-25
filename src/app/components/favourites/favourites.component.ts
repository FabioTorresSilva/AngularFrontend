import { Component, OnInit } from '@angular/core';
import { Fountain } from '../../Models/fountain';
import { FountainService } from '../../Services/fountain.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  favorites: Fountain[] = [];
  isUserLoggedIn: boolean = false;
  // Will hold the analysis data from the endpoint.
  analysisData: AnalysisData | null = null;

  constructor(
    private fountainService: FountainService,
    private authService: AuthService,
    public router: Router 
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user && user.id) {
        this.isUserLoggedIn = true;
        // Fetch the user favorites.
        this.fountainService.getUserFavourites(user.id).subscribe({
          next: (data: Fountain[]) => {
            this.favorites = data;
            console.log('Fetched favorites:', this.favorites);
            if (this.favorites.length > 0) {
              // Extract the IDs and pass them in the required format.
              const favoriteIds = this.favorites.map(f => f.id);
              this.fountainService.getFavoritesAnalysis(favoriteIds).subscribe({
                next: (analysis: AnalysisData) => {
                  this.analysisData = analysis;
                },
                error: (err) => console.error('Error fetching analysis:', err)
              });
            }
          },
          error: err => console.error('Error fetching favorites:', err)
        });
      } else {
        this.isUserLoggedIn = false;
        this.router.navigate(['/login']);
      }
    });
  }

  // Optional: Toggle favorite state (for example, to unfavorite a fountain)
  toggleFavorite(fav: Fountain): void {
    console.log('Toggle favorite:', fav);
    // Your toggle favorite logic goes here.
  }
}

interface AnalysisData {
  totalTests: number;
  lowestRadonValue: number;
  lowestRadonFountain: string;
  highestRadonValue: number;
  highestRadonFountain: string;
  drinkablePercentage: number;
}
