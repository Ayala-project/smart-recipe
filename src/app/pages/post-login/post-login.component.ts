import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-login',
  standalone: true,
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.css']
})
export class PostLoginComponent {
  constructor(private router: Router) {}

  navigateToCamera(): void {
    this.router.navigate(['/camera']);
  }

  navigateToRecipeBook(): void {
    this.router.navigate(['/recipe-book']);
  }
}