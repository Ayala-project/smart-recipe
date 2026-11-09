import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { FormsModule } from '@angular/forms';

interface Recipe {
  name: string;
  products: string[];
  instructions: string;
  image?: string;
  _id?: string;
  image_url: string; 
}

@Component({
  selector: 'app-recipe-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.css']
})
export class RecipeBookComponent implements OnInit {
  recipes: Recipe[] = [];
  userId: string | null = null;
  editingRecipe: Recipe | null = null;
  expandedRecipe: Recipe | null = null;
  tempInstructions: string = '';
  tempProducts: string = '';

  constructor(
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('username');
    if (!this.userId) {
      console.error('No user ID found in sessionStorage');
      this.router.navigate(['/login']);
      return;
    }
    this.loadRecipes();
  }
  getImageFileName(recipeName: string): string {
    const username = sessionStorage.getItem('username') || 'defaultuser';
    const cleanName = recipeName.replace(/[\s-]/g, '_'); // מחליף רווחים ומקפים בקו תחתון
    console.log(`Generating image file name for recipe: ${recipeName}`);
    console.log(`Username: ${username}, Clean Name: ${cleanName}`);
    return `${username}_${cleanName}.jpg`;
  }
  
  loadRecipes(): void {
    if (this.userId) {
      this.imageService.getRemainingRecipes(this.userId).subscribe({
        next: (response) => {
          console.log('Full server response:', response);
          if (response.remaining_recipes) {
            this.recipes = response.remaining_recipes;
            console.log('Recipes loaded from server:', this.recipes);
          } else {
            console.warn('No recipes found in response');
            this.recipes = [];
          }
        },
        error: (error) => {
          console.error('Error loading recipes:', error);
          alert('אירעה שגיאה בטעינת המתכונים');
        }
      });
    }
  }

  toggleRecipe(recipe: Recipe): void {
    if (this.expandedRecipe === recipe) {
      this.expandedRecipe = null;
    } else {
      this.expandedRecipe = recipe;
    }
  }

  closeExpandedRecipe(): void {
    this.expandedRecipe = null;
  }

  deleteRecipe(recipe: Recipe, event: Event): void {
    event.stopPropagation(); // מונע פתיחת המתכון בלחיצה על כפתור המחיקה
    if (!this.userId) return;
    
    if (confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
      this.imageService.deleteRecipe(this.userId, recipe.name).subscribe({
        next: (response) => {
          alert('המתכון נמחק בהצלחה');
          this.loadRecipes();
          if (this.expandedRecipe === recipe) {
            this.expandedRecipe = null;
          }
        },
        error: (error) => {
          console.error('Error deleting recipe:', error);
          alert('אירעה שגיאה במחיקת המתכון');
        }
      });
    }
  }

  startEdit(recipe: Recipe, event: Event): void {
    event.stopPropagation(); // מונע פתיחת המתכון בלחיצה על כפתור העריכה
    this.editingRecipe = {...recipe};
    this.tempInstructions = recipe.instructions;
    this.tempProducts = recipe.products.join(', ');
  }

  cancelEdit(): void {
    this.editingRecipe = null;
    this.tempInstructions = '';
    this.tempProducts = '';
  }

  saveRecipe(): void {
    if (!this.editingRecipe || !this.userId) return;

    const products = this.tempProducts.split(',').map(p => p.trim()).filter(p => p !== '');
    
    if (products.length === 0) {
      alert('חובה להזין לפחות מרכיב אחד');
      return;
    }

    const updatedRecipe = {
      ...this.editingRecipe,
      instructions: this.tempInstructions.trim(),
      products: products
    };

    this.imageService.updateRecipe(this.userId, updatedRecipe).subscribe({
      next: (response) => {
        alert('המתכון עודכן בהצלחה!');
        this.editingRecipe = null;
        this.loadRecipes();
      },
      error: (error) => {
        console.error('Error updating recipe:', error);
        alert('אירעה שגיאה בעדכון המתכון');
      }
    });
  }

  navigateToPostLogin(): void {
    this.router.navigate(['/post-login']);
  }
}