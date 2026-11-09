import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeStorageService {

  private apiUrl = 'http://localhost:5000'; // עדכן לפי השרת שלך

  constructor(private http: HttpClient) {}

  // שליפת מתכונים מהשרת לפי user_id
  getRecipes(userId: string): Observable<{ remaining_recipes: Recipe[] }> {
    return this.http.get<{ remaining_recipes: Recipe[] }>(
      `${this.apiUrl}/get_remaining_recipes?user_id=${userId}`
    );
  }

  // שליחת מתכונים לשרת ושמירתם לפי user_id
  saveRecipes(userId: string, recipes: Recipe[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/save_user_recipes`, {
      user_id: userId,
      recipes: recipes
    });
  }

  // עדכון מתכון אחד (למשל עריכה)
  updateRecipe(userId: string, recipe: Recipe): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_recipe`, {
      user_id: userId,
      recipe: recipe
    });
  }
}
