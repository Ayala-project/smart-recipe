import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errors: { [key: string]: string } = {};
  isSending: boolean = false;
  activeView: 'register' | 'login' = 'register';

  constructor(private router: Router) {}

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    // בדיקת שם משתמש
    if (!this.username.trim()) {
      this.errors['username'] = 'שם משתמש הוא שדה חובה';
      isValid = false;
    } else if (this.username.length < 3) {
      this.errors['username'] = 'שם משתמש חייב להכיל לפחות 3 תווים';
      isValid = false;
    }

    // בדיקת אימייל
    if (!this.email.trim()) {
      this.errors['email'] = 'אימייל הוא שדה חובה';
      isValid = false;
    } else if (!this.validateEmail(this.email)) {
      this.errors['email'] = 'אנא הזן כתובת אימייל תקינה';
      isValid = false;
    }

    // בדיקת סיסמה
    if (!this.password.trim()) {
      this.errors['password'] = 'סיסמה היא שדה חובה';
      isValid = false;
    } else if (this.password.length < 6) {
      this.errors['password'] = 'הסיסמה חייבת להכיל לפחות 6 תווים';
      isValid = false;
    }

    return isValid;
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  register(): void {
    if (this.validateForm()) {
      this.isSending = true;
      
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      if (users[this.username]) {
        this.errors['username'] = 'שם משתמש זה כבר קיים במערכת';
        this.isSending = false;
        return;
      }

      users[this.username] = {
        email: this.email,
        password: this.password
      };

      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      // אנימציית שליחה
      setTimeout(() => {
        alert('ההרשמה בוצעה בהצלחה!');
        this.router.navigate(['/login']);
      }, 1000);
    }
  }

  // מעבר לדף הכניסה
  onLoginClick(): void {
    this.activeView = 'login';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }
}
