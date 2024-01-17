import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SelectVehicleComponent } from './components/select-vehicle/select-vehicle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation, fadeInUpOnEnterAnimation, fadeOutUpOnLeaveAnimation, fadeInLeftOnEnterAnimation, fadeOutRightOnLeaveAnimation } from 'angular-animations';

import VehiclesAvgData from '../assets/json/avg.json'
import HelpersData from '../assets/json/helpers.json'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgSelectModule, FormsModule, HttpClientModule, SelectVehicleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    fadeInUpOnEnterAnimation({ duration: 300, translate: '50px'}),
    fadeOutUpOnLeaveAnimation({ duration: 300, translate: '20px' }),
    fadeInLeftOnEnterAnimation({ duration: 200, translate: '50px'}),
    fadeOutRightOnLeaveAnimation({ duration: 200, translate: '50px' }),
    
    fadeOutLeftOnLeaveAnimation({ duration: 200, translate: '50px' }),
    fadeInRightOnEnterAnimation({ duration: 200, translate: '50px' }),
  ],
})
export class AppComponent {
  vehicles_avg = VehiclesAvgData;
  helpers = HelpersData;
  vehicle_selected: any;
  kms: any;
  percentage: any = 50;

  step = 0;
  step_total = 3;

  result: any;

  onVehicleChange(vehicle: any) {
    this.vehicle_selected = vehicle;
    console.log("Vehicle:", this.vehicle_selected);
  }

  onAvgOpptionChange(event: any) {
    this.vehicle_selected = this.vehicles_avg.find(vehicle => vehicle.id == event.target.value);
    console.log("Vehicle2:", this.vehicle_selected);
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    /*this.vehicle_selected = this.vehicles_avg[0];
    this.kms = 100;
    this.calculate();
    this.step = 3;
    */
  }

  next(){
    this.step++;
  }

  prev(){
    this.step--;
  }

  progress(){
    return (this.step*100) / this.step_total
  }

  calculate() {
    if (this.kms == null || isNaN(this.kms) || this.kms <= 0)
      throw new Error('Invalid kms value');
    let kms = parseFloat(this.kms);
    let emissionsMin = parseFloat(this.vehicle_selected.emissionsMin);
    let emissionsMax = parseFloat(this.vehicle_selected.emissionsMax);

    // Calculate the average emissions
    let emissionsAvg = (emissionsMin + emissionsMax) / 2;

    // The conversion factor from kgCO2 to trees
    const kgCO2_to_trees = 6;

    // Calculate the maximum monthly and annual emissions in ToCo2
    let monthly_emissions = (emissionsAvg * kms) / 1000; 
    let annual_emissions = monthly_emissions * 12; 

    // Calculate the number of trees needed to neutralize the emissions
    let trees_to_neutralize_monthly = monthly_emissions * kgCO2_to_trees; // For a month
    let trees_to_neutralize_annually = annual_emissions * kgCO2_to_trees; // For a year

    // Create an object with the 3 calculated values and return it
    this.result = {
      monthly_emissions: monthly_emissions,
      annual_emissions: annual_emissions,
      trees_to_neutralize_monthly: trees_to_neutralize_monthly,
      trees_to_neutralize_annually: trees_to_neutralize_annually
    };

    this.step++;
  }

  calculateValues(){
    
  }
}
