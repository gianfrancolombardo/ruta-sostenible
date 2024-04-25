import { Component, Input, SimpleChanges} from '@angular/core';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-confetti',
  standalone: true,
  imports: [],
  templateUrl: './confetti.component.html',
  styleUrl: './confetti.component.css'
})
export class ConfettiComponent {
  @Input() percentage: any;
  
  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['percentage']) {
      if (changes['percentage'].currentValue === 100) {
        this.celebrate();
      }
    }
  }

  celebrate() {
    const duration = 3000; // in milliseconds
  
    confetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.6 },
    });
  
    // Clear confetti after a certain duration
    setTimeout(() => confetti.reset(), duration);
  }
}
