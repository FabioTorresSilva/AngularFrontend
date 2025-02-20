// fountain-detail.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // for ngIf
import { FountainStreetViewComponent } from '../Maps/fountain-street-view/fountain-street-view.component';

@Component({
  selector: 'app-fountain-detail',
  standalone: true,
  imports: [CommonModule, FountainStreetViewComponent],
  templateUrl: './fountaindetail.component.html',
  styleUrls: ['./fountaindetail.component.css'] // optional
})
export class FountainDetailComponent {
  fountain: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.fountain = navigation?.extras.state?.['fountain'];
  }
}