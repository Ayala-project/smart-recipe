import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isSending: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.printAllUsers();
  }

  printAllUsers() {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    console.log('--- רשימת כל המשתמשים הרשומים ---');
    Object.entries(users).forEach(([username, details]: [string, any]) => {
      console.log(`שם משתמש: ${username}`);
      console.log(`אימייל: ${details.email}`);
      console.log(`סיסמה: ${details.password}`);
      console.log('------------------------');
    });
  }

  login() {
    if (this.username && this.password) {
      this.isSending = true;
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      if (users[this.username] && users[this.username].password === this.password) {
        setTimeout(() => {
          sessionStorage.setItem('username', this.username);
          this.router.navigate(['/post-login']);
        }, 1000);
      } else {
        setTimeout(() => {
          this.isSending = false;
          alert('שם משתמש או סיסמה שגויים');
        }, 1000);
      }
    }
  }
}
