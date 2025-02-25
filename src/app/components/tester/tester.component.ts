import { Component, OnInit } from '@angular/core';
import { WaterAnalysisService, WaterAnalysis } from '../../Services/water-analysis.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./tester.component.css']
})
export class TesterComponent {
  selectedMenu: string = 'waterAnalysis';
  waterAnalysisData: WaterAnalysis = {
    fountainId: 0,
    deviceId: 0,
    radonConcentration: 0,
    date: new Date()
  };

  constructor(private waterAnalysisService: WaterAnalysisService) {}



  setMenu(menu: string): void {
    this.selectedMenu = menu;
  }

  submitWaterAnalysis() {
    this.waterAnalysisService.addWaterAnalysis(this.waterAnalysisData).subscribe({
      next: (response) => {
        console.log('Análise de água criada com sucesso:', response);
        alert('Análise de água criada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao criar análise de água:', err);
        alert('Erro ao criar análise de água. Verifique os dados e tente novamente.');
      }
    });
  }
}