import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

interface ServerResponse {
  result?: {
    question?: string;
    code?: number;
    recipes?: Array<{ name: string; products: string[]; instructions: string; image?: string }>;

  };
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = 'http://localhost:5000';
  private originalCode: string | null = null;

  private questionSubject = new BehaviorSubject<{ question: string; code: number } | null>(null);
  private recipeSubject = new BehaviorSubject<{ name: string; products: string[]; instructions: string; image?: string }[] | null>(null);

  private imageUrlSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  getQuestion(): Observable<{ question: string; code: number } | null> {
    return this.questionSubject.asObservable();
  }

  getRecipe(): Observable<{ name: string; products: string[]; instructions: string }[] | null> {
    return this.recipeSubject.asObservable();
  }

  getImageUrl(): Observable<string | null> {
    return this.imageUrlSubject.asObservable();
  }

  setQuestion(question: { question: string; code: number } | null): void {
    console.log('Setting question:', question);
    if (question?.code) {
      this.originalCode = question.code.toString();
      console.log('Saved original code:', this.originalCode);
    }
    this.questionSubject.next(question);
  }

  setRecipe(recipes: { name: string; products: string[]; instructions: string; image?: string }[] | null): void {
    this.recipeSubject.next(recipes);
  }
  
  setImageUrl(url: string | null): void {
    console.log('Setting image URL:', url);
    this.imageUrlSubject.next(url);
  }

  sendImage(formData: FormData): Observable<any> {
    console.log('Sending image to server');
    // איפוס הקוד המקורי בכל פעם שמתחילים תהליך חדש
    this.originalCode = null;
    const userId = sessionStorage.getItem('username'); // ✅ הוספת המשתמש
    formData.append('userId', userId || ''); // ✅ שליחה עם התמונה
    console.log('Form data prepared with userId:', userId);
    return this.http.post<ServerResponse>(`${this.apiUrl}/get_similar_images`, formData, {
      withCredentials: true
    }).pipe(
      tap(response => {
        console.log('Server response for image:', response);
        if (response?.result?.question && response?.result?.code) {
          const originalCode = response.result.code;
          this.setQuestion({
            question: response.result.question,
            code: originalCode
          });
        }
        if (response?.result?.recipes) {
          this.setRecipe(response.result.recipes);
        }
      }),
      catchError(error => {
        console.error('Error sending image:', error);
        return throwError(() => error);
      })
    );
  }

  submitAnswer(answer: string, code: string): Observable<any> {
    const codeToSend = this.originalCode || code;
    console.log('Submitting answer with original code:', codeToSend);
    const userId = sessionStorage.getItem('username'); // ✅ הוספת המשתמש

    return this.http.post<ServerResponse>(`${this.apiUrl}/submit_answer`, {
      answer,
      code: codeToSend,
      userId // ✅ נשלח לשרת
    }, {
      withCredentials: true
    }).pipe(
      tap(response => {
        console.log('Server response for answer:', response);
        if (response?.result?.question && response?.result?.code) {
          this.setQuestion({
            question: response.result.question,
            code: parseInt(codeToSend) // שימוש באותו קוד מקורי
          });
        }
        if (response?.result?.recipes) {
          this.setRecipe(response.result.recipes);
          this.originalCode = null; // איפוס הקוד המקורי כשמגיעים למתכונים
        }
      }),
      catchError(error => {
        console.error('Error submitting answer:', error);
        return throwError(() => error);
      })
    );
  }

  getRemainingRecipes(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_remaining_recipes`, {
      params: { user_id: userId },
      withCredentials: true
    }).pipe(
      tap(response => {
        console.log('Remaining recipes response:', response);
      }),
      catchError(error => {
        console.error('Error getting recipes:', error);
        return throwError(() => error);
      })
    );
  }

  updateRecipe(userId: string, recipe: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_recipe`, {
      user_id: userId,
      recipe: recipe
    }, {
      withCredentials: true
    }).pipe(
      tap(response => {
        console.log('Update recipe response:', response);
      }),
      catchError(error => {
        console.error('Error updating recipe:', error);
        return throwError(() => error);
      })
    );
  }

  deleteRecipe(userId: string, recipeName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete_recipe`, {
      user_id: userId,
      recipe_name: recipeName
    }, {
      withCredentials: true
    }).pipe(
      tap(response => {
        console.log('Delete recipe response:', response);
      }),
      catchError(error => {
        console.error('Error deleting recipe:', error);
        return throwError(() => error);
      })
    );
  }
}
