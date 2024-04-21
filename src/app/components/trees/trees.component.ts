import { Component, Input, SimpleChanges } from '@angular/core';

import { fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-trees',
  standalone: true,
  imports: [],
  templateUrl: './trees.component.html',
  styleUrl: './trees.component.css',
  animations: [
    fadeInUpOnEnterAnimation({ duration: 200, translate: '50px' }),
    fadeOutDownOnLeaveAnimation({ duration: 200, translate: '50px' })
  ],
})
export class TreesComponent {
  @Input() step: any;
  @Input() percentage: any;

  trees: any[] = [];
  ranges = {
    x: { min: 0, max: 100 },
    y: { min: 0, max: 100 },
    w: { min: 20, max: 60 },
    delay: { min: 100, max: 500 },
    duration: { min: 100, max: 700 },
    type: { min: 1, max: 1 },
  };
  max_trees = 100;
  originalTrees: number = 0;

  randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateTrees(numTrees: number, is_new: boolean = true): void {
    numTrees = Math.round(numTrees);

    if (is_new) {
      if (numTrees > this.max_trees)
        numTrees = this.max_trees;

      this.clearTrees();
      this.originalTrees = numTrees;
      numTrees = Math.round(numTrees / 2) // Divide by 2 because input range start at 50
    }
    //console.log('Generating trees:', numTrees);

    for (let i = 0; i < numTrees; i++) {
      let tree = {
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

      this.trees.push(tree);
    }
    //console.log('Tree:', this.trees);
  }

  clearTrees() {
    this.trees = [];
  }

  timer: any;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['percentage']) {

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.recreateTrees(changes);
      }, 500);
    }
  }

  recreateTrees(changes: SimpleChanges) {
    //console.log('Finalizing changes:');
    let newTotalTrees = Math.floor(
      (this.originalTrees * changes['percentage'].currentValue) / 100
    );
    let diff = newTotalTrees - this.trees.length;

    /*console.log(
      'Array', this.trees.length,
      'Trees:', this.originalTrees,
      'Percentage:', changes['percentage'].currentValue,
      'Diff:', diff,
      'New total:', newTotalTrees
    );*/

    if (diff > 0) {
      this.generateTrees(diff, false);
    } else if (diff < 0) {
      this.trees.splice(0, -diff);
    }
  }
}
