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
  imports:  [ CommonModule, RouterModule],
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  favorites: Fountain[] = [];
  isUserLoggedIn: boolean = false;

  constructor(
    private fountainService: FountainService,
    private authService: AuthService,
    public router: Router 
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user && user.id) {
        this.isUserLoggedIn = true;
        this.fountainService.getUserFavourites(user.id).subscribe({
          next: (data: Fountain[]) => {
            this.favorites = data;
            console.log('Fetched favorites:', this.favorites);
          },
        });
      } else {
        this.isUserLoggedIn = false;
        this.router.navigate(['/login']);
      }
    });
  }

  // Optional: Toggle favorite state (for example, to unfavorite a fountain)
  toggleFavorite(fav: Fountain): void {
    // Implement your logic to remove/add a favorite.
    console.log('Toggle favorite:', fav);
  }
}
