import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // הוספת HttpClientModule
import { ImageUploadService } from '../../services/image-upload.service';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // הוספת HttpClientModule כאן
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css'],
})
export class UploadImageComponent {
  private basePath = 'T:\\Food Images';

  constructor(
    private imageUploadService: ImageUploadService,
    private router: Router
  ) {}

  triggerFileInput() {
    const fileInput = document.getElementById('upload') as HTMLInputElement;
    fileInput.click();
  }
  captureImage(): void {
    const captureInput = document.createElement('input');
    captureInput.type = 'file';
    captureInput.accept = 'image/*';
    captureInput.capture = 'camera';
  
    captureInput.onchange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const file: File | null = input.files?.[0] || null;
      if (file) {
        console.log('Captured image:', file);
      }
    };
  
    captureInput.click();
  }
  onFileSelected(event: Event): void {
    console.log('onFileSelected התחיל');
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files?.[0] || null;
    if (file) {
      console.log('קובץ נבחר:', file.name);
      const formData = new FormData();
      formData.append('image', file);

      console.log('מעבר לדף loading');
      this.router.navigate(['/loading']);

      this.imageUploadService.uploadImage(formData).subscribe({
        next: (response) => {
          console.log('העלאה הצליחה:', response);
          this.router.navigate(['/questions']);
        },
        error: (error) => {
          console.error('שגיאה בהעלאת הקובץ:', error);
          this.router.navigate(['/camera']);
        },
      });
    } else {
      console.log('לא נבחר קובץ');
    }
  }
}