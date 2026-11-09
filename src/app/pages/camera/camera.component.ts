import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-camera',
  standalone: true,
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
  imports: [CommonModule],
})
export class CameraComponent implements OnInit {
  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('canvas') canvasElement!: ElementRef;

  capturedImage: string | null = null;
  isCameraActive: boolean = false;

  constructor(private imageService: ImageService, private router: Router) {}

  ngOnInit(): void {
    const username = sessionStorage.getItem('username');
    if (!username) {
      alert('You must log in first!');
      this.router.navigate(['/login']);
    }
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      const video = this.videoElement.nativeElement;
      video.srcObject = stream;
      video.play();
      this.isCameraActive = true;
    }).catch(err => {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera.');
    });
  }

  captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.capturedImage = canvas.toDataURL('image/png');
    this.imageService.setImageUrl(this.capturedImage as string);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.capturedImage = e.target.result;
        this.imageService.setImageUrl(this.capturedImage);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage() {
    if (!this.capturedImage) {
      alert('No image selected or captured.');
      return;
    }

    // קודם כל עוברים למסך טעינה
    this.router.navigate(['/loading']).then(() => {
      const blob = this.dataURItoBlob(this.capturedImage as string);
      const formData = new FormData();
      formData.append('image', blob);
      
      // שליחת התמונה לשרת
      this.imageService.sendImage(formData)
        .pipe(
          finalize(() => {
            console.log('Image upload completed');
          })
        )
        .subscribe({
          next: (res: any) => {
            console.log('Server response:', res);
            
            if (res.result?.question && res.result?.code !== undefined) {
              this.imageService.setQuestion({
                question: res.result.question,
                code: res.result.code
              });
              sessionStorage.setItem('code', res.result.code.toString());
              this.imageService.setRecipe(null);
            } else if (res.result?.recipes) {
              this.imageService.setRecipe(res.result.recipes);
              this.imageService.setQuestion(null);
            }

            // רק אחרי שקיבלנו תשובה מהשרת, נעבור לדף השאלות
            this.router.navigate(['/questions']);
          },
          error: (err: any) => {
            console.error('Error uploading image:', err);
            alert('אירעה שגיאה בשליחת התמונה.');
            // במקרה של שגיאה, נחזור לדף המצלמה
            this.router.navigate(['/camera']);
          }
        });
    });
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}
