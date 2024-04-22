import { Component } from '@angular/core';
import {
  fadeInUpOnEnterAnimation,
} from 'angular-animations';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.css',
  animations: [
    fadeInUpOnEnterAnimation({ duration: 300, translate: '50px' }),
  ],
})
export class CookiesComponent {

  show_cookies:boolean = false;

  constructor() { 
    if (localStorage.getItem('allows_cookies')==null)
      this.show_cookies=true
  }

  set_cookies(response:boolean){
    this.show_cookies=false
    if (response)
      localStorage.setItem('allows_cookies', 'true');
    else
      window.location.href = "https://google.com";
  }

}
