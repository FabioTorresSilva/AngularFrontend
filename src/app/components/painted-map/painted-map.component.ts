import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

interface Place {
  name: string;
  color: string;
}

@Component({
  selector: 'app-painted-map',
  standalone: true,
  imports: [GoogleMapsModule], 
  templateUrl: './painted-map.component.html',
  styleUrls: ['./painted-map.component.css'],
})

export class PaintedMapComponent implements AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  
  center = { lat: 41.7, lng: -8.8 }; // Center of Viana do Castelo
  zoom = 6;
  cityPolygon!: google.maps.Polygon;

  places: Place[] = [
    { name: 'Lisboa', color: '#FF5733' },
    { name: 'Viana do Castelo', color: '#33FF57' },
    { name: 'Barroselas', color: '#FF33AA' },
    {name: "Coimbra", color: "#FF5733"} 
  ];
  

  ngAfterViewInit() {
    // Loop through each place and fetch its boundary
    this.places.forEach(place => {
      this.fetchCityBoundary(place.name, place.color);

    });
  }

  fetchCityBoundary(cityName: string, color: string) {
    const overpassQuery = `
      [out:json];
      relation["name"="${cityName}"]["boundary"="administrative"](36.8,-9.5,42.2,-6.5);
      out geom;
    `;
    
    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`)
      .then(response => response.json())
      .then(data => {
        console.log('Overpass API Response:', data);
        
        if (data.elements && data.elements.length > 0) {
          const relation = data.elements[0];
          let coordinates: google.maps.LatLngLiteral[] = [];
          
          // Use the relation bounds to recenter the map if available.
          if (relation.bounds) {
            const bounds = relation.bounds;
            const newCenter = {
              lat: (bounds.minlat + bounds.maxlat) / 2,
              lng: (bounds.minlon + bounds.maxlon) / 2,
            };
            this.center = newCenter;
            // If the googleMap is already initialized, update its center
            if (this.map && this.map.googleMap) {
              this.map.googleMap.setCenter(newCenter);
            }
            console.log('New Map Center:', newCenter);
          }
          
          // Iterate over relation members to extract coordinates from "outer" ways.
          if (relation.members && relation.members.length > 0) {
            relation.members.forEach((member: any) => {
              if (member.type === 'way' && member.role === 'outer' && member.geometry && member.geometry.length > 0) {
                member.geometry.forEach((point: any) => {
                  if (typeof point.lat === 'number' && typeof point.lon === 'number') {
                    coordinates.push({ lat: point.lat, lng: point.lon });
                  }
                });
              }
            });
          }
          
          console.log('Extracted Coordinates:', coordinates);
          
          if (coordinates.length > 0) {
            if (coordinates.length > 0) {
              this.drawPolygon(coordinates, color);
            }
          } else {
            console.error('No valid coordinates found for', cityName);
          }
        } else {
          console.error('No boundary data found for', cityName);
        }
      })
      .catch(error => console.error('Error fetching city boundaries:', error));
  }
  
  drawPolygon(paths: google.maps.LatLngLiteral[], color: string) {
    if (!this.map || !this.map.googleMap) {
      console.error('Google Map is not initialized yet!');
      return;
    }
  
    this.cityPolygon = new google.maps.Polygon({
      paths: paths,
      strokeColor: color,  // <-- Use the color passed as a parameter
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,    // <-- Use the color passed as a parameter
      fillOpacity: 0.35,
    });
  
    this.cityPolygon.setMap(this.map.googleMap!);
    console.log(`Polygon drawn successfully with color ${color}`);
  }
  
}  
