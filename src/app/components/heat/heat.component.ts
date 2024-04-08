import { Component, Input, SimpleChanges } from '@angular/core';

import {
  fadeInDownOnEnterAnimation,
} from 'angular-animations';

@Component({
  selector: 'app-heat',
  standalone: true,
  imports: [],
  templateUrl: './heat.component.html',
  styleUrl: './heat.component.css',
  animations: [
    fadeInDownOnEnterAnimation({ duration: 300, translate: '50px' }),
  ]
})
export class HeatComponent {
  @Input() step: any;
  @Input() percentage: any;

  maxHeat: number = 0.8;
  currentHeat: number = 0.5;
  minHeat: number = 0;

  calculateHeat(percentage: number) {
    percentage = 100 - percentage;
    return this.minHeat + (percentage * (this.maxHeat - this.minHeat)) / 100;
  }

  timer: any;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['percentage']) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.currentHeat = this.calculateHeat(changes['percentage'].currentValue);
        console.log('currentHeat:', this.currentHeat);
      }, 500);
    }
  }
}
