import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContinuousDevicePayload, FountainService, NormalDevicePayload, WaterAnalysisPayload } from '../../Services/fountain.service';
import { AuthService } from '../../Services/auth.service';
import { WaterAnalysis } from '../../Models/wateranalysis';
import { WaterAnalysisService } from '../../Services/water-analysis.service';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./tester.component.css']
})

export class TesterComponent implements OnInit {
  selectedMenu: string = 'water-analysis';
  deviceType: 'normal' | 'continuous' = 'normal';

  // Form models for each device type:
  normalDevice: NormalDevicePayload = {
    model: '',
    serialNumber: '',
    expirationDate: ''
  };

  continuousDevice: ContinuousDevicePayload = {
    model: '',
    serialNumber: '',
    expirationDate: '',
    analysisFrequency: 0,
    lastAnalysisDate: ''
  };

  deviceSuccessMessage: string = '';
  newAnalysis: WaterAnalysisPayload = {
    radonConcentration: 0,
    fountainId: 0,
    date: '',
    deviceId: 0
  };

  successMessage: string = '';

  userAnalysis: WaterAnalysis[] = [];

  constructor(private fountainService: FountainService, private authService: AuthService, private waterAnalysisService: WaterAnalysisService) { }

  setMenu(menu: string): void {
    this.selectedMenu = menu
  }


  createNormalDevice(): void {
    // Optionally, format the expirationDate if needed (usually the <input type="date"> returns "YYYY-MM-DD")
    console.log('Normal Device Payload:', this.normalDevice);
    this.fountainService.createNormalDevice(this.normalDevice).subscribe({
      next: (res) => {
        this.deviceSuccessMessage = 'Dispositivo normal criado com sucesso';
        console.log('Normal device created:', res);
        // Reset form
        this.normalDevice = { model: '', serialNumber: '', expirationDate: '' };
      },
      error: (err) => {
        console.error('Error creating normal device:', err);
        this.deviceSuccessMessage = '';
      }
    });
  }

  // Called when the tester submits the continuous device form
  createContinuousDevice(): void {
    // Optionally, format the dates if needed
    console.log('Continuous Device Payload:', this.continuousDevice);
    this.fountainService.createContinuousDevice(this.continuousDevice).subscribe({
      next: (res) => {
        this.deviceSuccessMessage = 'Dispositivo de uso contínuo criado com sucesso';
        console.log('Continuous use device created:', res);
        // Reset form
        this.continuousDevice = { model: '', serialNumber: '', expirationDate: '', analysisFrequency: 0, lastAnalysisDate: '' };
      },
      error: (err) => {
        console.error('Error creating continuous use device:', err);
        this.deviceSuccessMessage = '';
      }
    });
  }

  ngOnInit(): void {
    this.loadUserAnalysis();
  }

  loadUserAnalysis(): void {
    const currentUser = this.authService.currentUser;
    console.log(currentUser?.id)
    if (currentUser && currentUser.id) {
      this.waterAnalysisService.getUserAnalysis(currentUser.id).subscribe({
        next: (data: WaterAnalysis[]) => {
          this.userAnalysis = data;
          console.log('Fetched user water analysis:', this.userAnalysis);
        },
        error: (err) => console.error('Error fetching user analysis:', err)
      });
    }
  }

  createWaterAnalysis(): void {
    const formattedDate = new Date(this.newAnalysis.date).toISOString().split('T')[0];

    const payload: WaterAnalysisPayload = {
      radonConcentration: this.newAnalysis.radonConcentration,
      fountainId: this.newAnalysis.fountainId,
      date: formattedDate,
      deviceId: this.newAnalysis.deviceId
    };

    console.log('Payload:', payload);

    this.fountainService.createWaterAnalysis(payload).subscribe({
      next: (res) => {
        this.successMessage = 'Análise de água criada com sucesso';
        console.log('Created water analysis response:', res);

        // Assume the response contains the created water analysis ID (e.g., res.id)
        const waterAnalysisId = res.id;
        // Get current user id from your AuthService (assuming it exposes currentUser)
        const currentUser = this.authService.currentUser;
        if (currentUser && waterAnalysisId) {
          this.fountainService.associateWaterAnalysis(currentUser.id, waterAnalysisId).subscribe({
            next: (assocRes) => {
              console.log('Associated water analysis to tester:', assocRes);
              this.loadUserAnalysis();
            },
            error: (assocErr) => {
              console.error('Error associating water analysis:', assocErr);
            }
          });
        }

        // Reset the form
        this.newAnalysis = {
          radonConcentration: 0,
          fountainId: 0,
          date: '',
          deviceId: 0
        };
      },
      error: (err) => {
        console.error('Error creating water analysis:', err);
        this.successMessage = '';
      }
    });
  }
}  