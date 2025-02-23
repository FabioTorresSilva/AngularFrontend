import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FountainStreetViewComponent } from '../Maps/fountain-street-view/fountain-street-view.component';
import { FountainService } from '../../Services/fountain.service'; // service to fetch fountain details
import { Fountain } from '../../Models/fountain';
import { GeocodingService } from '../../Services/geocoding.service';

@Component({
  selector: 'app-fountain-detail',
  standalone: true,
  imports: [CommonModule, FountainStreetViewComponent],
  templateUrl: './fountaindetail.component.html',
  styleUrls: ['./fountaindetail.component.css']
})

export class FountainDetailComponent implements OnInit {
  fountain: Fountain | null = null;
  loadingAddress: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fountainService: FountainService,
    private geocodingService: GeocodingService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fountainService.getFountainById(+id).subscribe(data => {
          this.fountain = data;

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
        });
      }
    });
  }
}