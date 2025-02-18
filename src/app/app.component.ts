import { Component } from '@angular/core';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { HeatMapComponent } from './components/heat-map/heat-map.component';
import { PaintedMapComponent } from "./components/painted-map/painted-map.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GoogleMapComponent, HeatMapComponent, PaintedMapComponent],  // Import the GoogleMapComponent here
  template: `<app-google-map></app-google-map>,
  <app-heat-map></app-heat-map>,
  <app-painted-map></app-painted-map>`,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
