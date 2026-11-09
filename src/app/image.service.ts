import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private apiUrl = 'http://localhost:5000';

  private questionSubject = new BehaviorSubject<string | null>(null);
  private recipeSubject = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient) {}

  getQuestion(): Observable<string | null> {
    return this.questionSubject.asObservable();
  }


  getRecipe(): Observable<any | null> {
    return this.recipeSubject.asObservable();
  }

  setQuestion(question: string | null): void {
    this.questionSubject.next(question);
  }

  setRecipe(recipe: any | null): void {
    this.recipeSubject.next(recipe);
  }

  // שליחת תמונה לשרת
  sendImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/get_similar_images`, formData, {
      withCredentials: true, // שומר session
    });
  }

  // שליחת תשובה לשרת
  submitAnswer(answer: string, username: string): Observable<any> {
    console.log('Answer:', answer);
    console.log('Username:', username);
    return this.http.post(
      `${this.apiUrl}/submit_answer`,
      { answer, username },
      { withCredentials: true }
    );
  }

  // ✅ שליחת בקשה ל-get_similar_images
  getSimilarImages(imagePath: string, username: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/get_similar_images`,
      { image_path: imagePath, username },
      { withCredentials: true }
    );
  }
}
