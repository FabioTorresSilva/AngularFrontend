import { Component } from '@angular/core';
import { LatLng, MapComponent } from '../Maps/map/map.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {
  locations: LatLng[] = [
    //41.3179459 / -7.7667603
    { id: 1, lat: 41.3179459, lng: -7.7667603, description: "Lordelo/VilaReal", isDrinkable: true, susceptibilityIndex: 2 },
    //41.2702826 / -8.0892741 Amarante
    { id: 2, lat: 41.2702826, lng: -8.0892741, description: "Amarante", isDrinkable: false, susceptibilityIndex: 4 },
    //41.6653545 / -8.7411137 Viana/braga
    { id: 3, lat: 41.6653545, lng: -8.7411137, description: "Fountain 3", isDrinkable: true, susceptibilityIndex: 1 },
    //37.7043605 / -8.0869173
    { id: 3, lat: 37.7043605, lng: -8.0869173, description: "Fountain 3", isDrinkable: true, susceptibilityIndex: 1 }
  ];
}
