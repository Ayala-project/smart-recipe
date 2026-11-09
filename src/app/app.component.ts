import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="logo-container">
      <img src="/logo.png" alt="לוגו" class="logo">
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
     
      height: 100vh;
      width: 100vw;
    }
    
    .logo-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      justify-content: flex-end;
      padding: 10px 20px;
      pointer-events: none;
    }
    
    .logo {
      height: 60px;
      width: auto;
      object-fit: contain;
      pointer-events: all;
    }
  `]
})
export class AppComponent {}