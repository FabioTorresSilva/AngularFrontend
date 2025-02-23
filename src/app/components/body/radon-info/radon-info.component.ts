import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radon-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radon-info.component.html',
  styleUrls: ['./radon-info.component.css']
})
export class RadonInfoComponent {
  selectedTopic: 'radon' | 'water' = 'radon'; 
}
