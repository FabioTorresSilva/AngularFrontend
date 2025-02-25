import { Component, OnInit } from '@angular/core';
import { Fountain } from '../../Models/fountain';
import { FountainService } from '../../Services/fountain.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

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
  analysisData: AnalysisData | null = null;

  constructor(
    private fountainService: FountainService,
    private authService: AuthService,
    public router: Router 
  ) {}

  ngOnInit(): void {
    this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (user && user.id) {
          this.isUserLoggedIn = true;
          return this.fountainService.getUserFavourites(user.id);
        } else {
          this.isUserLoggedIn = false;
          this.router.navigate(['/login']);
          return of([]); // Ensure it returns an observable
        }
      })
    ).subscribe({
      next: (data: Fountain[]) => {
        this.favorites = [...data]; // Copy to avoid direct reference
        console.log('Fetched favorites:', this.favorites);
        if (this.favorites.length > 0) {
          const favoriteIds = this.favorites.map(f => f.id);
          this.fountainService.getFavoritesAnalysis(favoriteIds).pipe(take(1)).subscribe({
            next: (analysis: AnalysisData) => {
              this.analysisData = analysis;
            },
            error: (err) => console.error('Error fetching analysis:', err)
          });
        }
      },
      error: err => console.error('Error fetching favorites:', err)
    });
  }

  toggleFavorite(fav: Fountain): void {
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      console.error('User not logged in.');
      return;
    }

    this.fountainService.toggleFavorite(currentUser.id, fav.id).pipe(
      take(1),
      switchMap(() => {
        return this.fountainService.getUserFavourites(currentUser.id);
      })
    ).subscribe({
      next: (data: Fountain[]) => {
        this.favorites = [...data]; // Copy to avoid direct reference
        console.log('Updated favorites:', this.favorites);
        if (this.favorites.length > 0) {
          const favoriteIds = this.favorites.map(f => f.id);
          this.fountainService.getFavoritesAnalysis(favoriteIds).pipe(take(1)).subscribe({
            next: (analysis: AnalysisData) => {
              this.analysisData = analysis;
            },
            error: (err) => console.error('Error fetching analysis:', err)
          });
        } else {
          this.analysisData = null; // Clear analysis data if no favorites
        }
      },
      error: (err) => console.error('Error refreshing favorites:', err)
    });
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
