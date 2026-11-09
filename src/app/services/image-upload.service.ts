import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private readonly API_URL = 'http://localhost:5000'; // עדכן את הכתובת אם השרת פועל על פורט אחר

  constructor(private http: HttpClient) {}

  /**
   * העלאת תמונה או נתיב תמונה לשרת
   * @param formData נתוני הטופס
   * @returns Observable עם התגובה מהשרת
   */
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}/image/upload`, formData).pipe(
      catchError((error) => {
        console.error('Error in uploadImage:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * פונקציה לקבלת שאלה או מתכונים מהשרת
   * @returns Observable עם השאלה או רשימת המתכונים
   */
  getQuestionOrRecipes(): Observable<{ question?: string; recipes?: string[] }> {
    return this.http.get<{ question?: string; recipes?: string[] }>(
      `${this.API_URL}/get_remaining_recipes`
    ).pipe(
      catchError((error) => {
        console.error('Error in getQuestionOrRecipes:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * פונקציה לשליחת תשובה לשרת
   * @param answer התשובה שנשלחה מהמשתמש
   * @returns Observable עם תגובה מהשרת
   */
  submitAnswer(answer: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/submit_answer`, { answers: answer }).pipe(
      catchError((error) => {
        console.error('Error in submitAnswer:', error);
        return throwError(() => error);
      })
    );
  }
}