import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { RecipeStorageService } from '../../services/recipe-storage.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions-recipes',
  standalone: true,
  templateUrl: './questions-recipes.component.html',
  styleUrls: ['./questions-recipes.component.css'],
  imports: [CommonModule],
  providers: [RecipeStorageService]
})
export class QuestionsRecipesComponent implements OnInit, OnDestroy {
  question: string | null = null;
  code: number | null = null;
  recipes: Array<{
    name: string;
    products: string[];
    instructions: string;
    image?: string;
  }> = [];
  imageUrl: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private imageService: ImageService,
    private recipeStorageService: RecipeStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // האזנה לשינויים בתמונה
    this.subscriptions.push(
      this.imageService.getImageUrl().subscribe(url => {
        console.log('Image URL updated:', url);
        this.imageUrl = url;
      })
    );

    // האזנה לשינויים בשאלה
    this.subscriptions.push(
      this.imageService.getQuestion().subscribe(questionData => {
        console.log('Question data updated:', questionData);
        if (questionData) {
          this.question = questionData.question;
          this.code = questionData.code;
          this.recipes = []; // מנקה את המתכונים כשיש שאלה
          sessionStorage.setItem('code', this.code.toString());
        }
      })
    );

    // האזנה לשינויים במתכונים
    this.subscriptions.push(
      this.imageService.getRecipe().subscribe(recipes => {
        console.log('Recipes updated:', recipes);
        if (recipes) {
          this.recipes = recipes;
          this.question = null; // מנקה את השאלה כשיש מתכונים
        }
      })
    );

    // טעינת המצב ההתחלתי
    this.code = Number(sessionStorage.getItem('code'));
    if (this.code) {
      this.fetchQuestionOrRecipes();
    }
  }

  ngOnDestroy(): void {
    // ניקוי ההרשמות
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchQuestionOrRecipes(): void {
    const username = sessionStorage.getItem('username');
    if (!username || !username.trim()) {
      alert('אתה חייב להתחבר קודם!');
      return;
    }

    if (this.code === null) {
      console.error('Code is missing');
      return;
    }

    console.log('Fetching with code:', this.code);
    this.imageService.submitAnswer('fetch', this.code.toString()).subscribe({
      next: (response: any) => {
        console.log('Server response:', response);
        if (response.result?.question && response.result?.code) {
          this.imageService.setQuestion({
            question: response.result.question,
            code: response.result.code
          });
        } else if (response.result?.recipes) {
          this.imageService.setRecipe(response.result.recipes);
          if (username) {
            this.recipeStorageService.saveRecipes(username, response.result.recipes);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        alert('אירעה שגיאה בטעינת הנתונים. אנא נסה שוב.');
      }
    });
  }

  submitAnswer(answer: string): void {
    const buttons = document.querySelectorAll('.answer-buttons button');
    buttons.forEach(button => {
      if ((button as HTMLElement).innerText.toLowerCase() === answer.toLowerCase()) {
        button.classList.add('clicked');
      }
    });

    // קריאה לשרת אחרי הוספת הקלאס
    if (this.code === null) {
      console.error('Code is missing');
      return;
    }

    this.imageService.submitAnswer(answer, this.code.toString()).subscribe({
      next: (response) => {
        if (response.result?.question && response.result?.code) {
          this.imageService.setQuestion({
            question: response.result.question,
            code: response.result.code
          });
        } else if (response.result?.recipes) {
          this.imageService.setRecipe(response.result.recipes);
          const username = sessionStorage.getItem('username');
          if (username) {
            this.recipeStorageService.saveRecipes(username, response.result.recipes);
          }
        }
        
        // הסרת הקלאס אחרי סיום האנימציה
        setTimeout(() => {
          buttons.forEach(button => button.classList.remove('clicked'));
        }, 500);
      },
      error: (err) => {
        console.error('Error submitting answer:', err);
        alert('אירעה שגיאה בשליחת התשובה. אנא נסה שוב.');
        buttons.forEach(button => button.classList.remove('clicked'));
      }
    });
  }

  onImageError(event: any) {
    console.error('Error loading image:', this.imageUrl);
    const img = event.target;
    img.style.display = 'none';
  }

  goToRecipeBook(): void {
    this.router.navigate(['/recipe-book']);
  }
}