import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tester',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tester.component.html',
  styleUrl: './tester.component.css'
})
export class TesterComponent {
  selectedMenu: string = 'water-analysis'; 
  setMenu(menu: string) {
    this.selectedMenu = menu;
  }
}