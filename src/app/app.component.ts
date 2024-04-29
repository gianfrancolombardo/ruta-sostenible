import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SelectVehicleComponent } from './components/select-vehicle/select-vehicle.component';
import { CloudsComponent } from './components/clouds/clouds.component';
import { HeatComponent } from './components/heat/heat.component';
import { TreesComponent } from './components/trees/trees.component';
import { CookiesComponent } from './components/cookies/cookies.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  fadeInRightOnEnterAnimation,
  fadeOutLeftOnLeaveAnimation,
  fadeInUpOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
  fadeInLeftOnEnterAnimation,
  fadeOutRightOnLeaveAnimation,
  fadeInDownOnEnterAnimation,
} from 'angular-animations';

import VehiclesAvgData from '../assets/json/avg.json';
import HelpersData from '../assets/json/helpers.json';
import { ConfettiComponent } from './components/confetti/confetti.component';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    SelectVehicleComponent,
    CloudsComponent,
    HeatComponent,
    TreesComponent,
    CookiesComponent,
    ConfettiComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    fadeInUpOnEnterAnimation({ duration: 300, translate: '50px' }),
    fadeInDownOnEnterAnimation({ duration: 300, translate: '50px' }),
    fadeOutUpOnLeaveAnimation({ duration: 300, translate: '20px' }),
    fadeInLeftOnEnterAnimation({ duration: 200, translate: '50px' }),
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

  @ViewChild(CloudsComponent) cloudsComponent: CloudsComponent =
    new CloudsComponent();
  @ViewChild(TreesComponent) treesComponent: TreesComponent =
    new TreesComponent();
  @ViewChild(HeatComponent) heatsComponent: HeatComponent = new HeatComponent();

  @ViewChild('modalinfo') modalinfo!: ElementRef<HTMLDialogElement>;
  @ViewChild('vehicles_avg_group') carRadioGroup!: ElementRef;

  onVehicleChange(vehicle: any) {
    // Uncheck all radio buttons (TODO: change all that for reactive forms)
    const radios: HTMLInputElement[] =
      this.carRadioGroup.nativeElement.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));

    this.vehicle_selected = vehicle;
    console.log('Vehicle:', this.vehicle_selected);
  }

  onAvgOptionChange(event: any) {
    this.vehicle_selected = this.vehicles_avg.find(
      (vehicle) => vehicle.id == event.target.value
    );
    console.log('Vehicle2:', this.vehicle_selected);
  }

  constructor(private _analytic: AnalyticsService) {}

  ngOnInit() {
    /* this.vehicle_selected = this.vehicles_avg[0];
    this.kms = 100;
    this.calculate();
    this.step = 1; */
  }

  next() {
    this.step++;

    if (this.step == 3) {
      this.animatePercentage();
    }
  }

  prev() {
    this.step--;
  }

  progress() {
    return (this.step * 100) / this.step_total;
  }

  calculate() {
    if (this.kms == null || isNaN(this.kms) || this.kms <= 0)
      throw new Error('Invalid kms value');
    let kms = parseFloat(this.kms);
    let emissionsMin = parseFloat(this.vehicle_selected.emissionsMin) / 1000; // KgCO2/km
    let emissionsMax = parseFloat(this.vehicle_selected.emissionsMax) / 1000; // KgCO2/km

    // Calculate the average emissions (kgCO2/km)
    let emissionsAvg = (emissionsMin + emissionsMax) / 2;

    // The conversion factor from kgCO2 to trees
    const kgCO2_for_tree_for_year = 20; // KgCO2

    // Calculate the maximum monthly and annual emissions in KgCo2
    let monthly_emissions = emissionsAvg * kms; // KgCO2/month
    let annual_emissions = monthly_emissions * 12; // KgCO2/year

    // Calculate the number of trees needed to neutralize the emissions
    let trees_to_neutralize_annually =
      annual_emissions / kgCO2_for_tree_for_year; // For a year
    let trees_to_neutralize_monthly = trees_to_neutralize_annually / 12; // For a month

    // Create an object with the 3 calculated values and return it
    this.result = {
      avg_emissions: emissionsAvg, // KgCO2/km
      monthly_emissions: monthly_emissions, // KgCO2/month
      annual_emissions: annual_emissions, // KgCO2/year
      trees_to_neutralize_monthly: trees_to_neutralize_monthly, // Trees/month
      trees_to_neutralize_annually: trees_to_neutralize_annually, // Trees/year
    };
    console.log('Result:', this.result);

    this.step++;

    this.cloudsComponent.generateClouds(this.result.monthly_emissions);
    this.treesComponent.generateTrees(this.result.trees_to_neutralize_annually);
    //this.heatsComponent.generateHeat(this.result.monthly_emissions);

    this._analytic.trackEvent(
      'Calculated',
      'Vehicle: ' + this.vehicle_selected.id + ' - Kms: ' + this.kms,
      'Data'
    );
  }

  calculateValues() {}

  /** Range Animation **/
  private direction = 1;
  private intervalId?: number;
  private hasReached40 = false;
  private firstTime = true;
  animatePercentage() {
    // Delay for UX
    if (this.firstTime) {
      this.firstTime = false;
      setTimeout(() => {
        this.intervalId = window.setInterval(() => {
          if (this.percentage === 60) {
            this.direction = -1;
          } else if (this.percentage === 40) {
            this.direction = 1;
            this.hasReached40 = true;
          }

          this.percentage += this.direction;

          if (this.percentage === 50 && this.hasReached40) {
            if (this.intervalId) {
              window.clearInterval(this.intervalId);
              this.intervalId = undefined;
              this.hasReached40 = false;
            }
          }
        }, 30);
      }, 700);
    }
  }
}
