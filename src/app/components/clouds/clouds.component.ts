import { Component, Input } from '@angular/core';

import {
  fadeInRightOnEnterAnimation,
  fadeInLeftOnEnterAnimation,
} from 'angular-animations';

@Component({
  selector: 'app-clouds',
  standalone: true,
  imports: [],
  templateUrl: './clouds.component.html',
  styleUrl: './clouds.component.css',
  animations: [
    fadeInRightOnEnterAnimation(),
    fadeInLeftOnEnterAnimation(),
  ],
})
export class CloudsComponent {
  @Input() step: any;

  clouds: any[] = [];
  ranges = {
    x: { min: -50, max: 150 },
    y: { min: 0, max: 80 },
    w: { min: 100, max: 200 },
    delay: { min: 100, max: 400 },
    duration: { min: 100, max: 700 },
    type: { min: 1, max: 2 },
  };

  randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  generateClouds(numClouds: number): void {
    this.clearClouds();
    for (let i = 0; i < numClouds; i++) {
      let cloud = {
        x: this.randomInRange(this.ranges.x.min, this.ranges.x.max),
        y: this.randomInRange(this.ranges.y.min, this.ranges.y.max),
        w: this.randomInRange(this.ranges.w.min, this.ranges.w.max),
        params: {
          delay: this.randomInRange(
            this.ranges.delay.min,
            this.ranges.delay.max
          ),
          duration: this.randomInRange(
            this.ranges.duration.min,
            this.ranges.duration.max
          ),
          translate: '50px',
        },
        type: this.randomInRange(this.ranges.type.min, this.ranges.type.max),
      };

      this.clouds.push(cloud);
    }
  }

  clearClouds() {
    this.clouds = [];
  }
}
