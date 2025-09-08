// File Path: src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  credentials = {
    usernameOrEmail: 'admin',
    password: 'P@ssword123'
  };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/dashboard']);
        console.log(response);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'ورود ناموفق بود. لطفاً دوباره تلاش کنید.';
        console.log(err);
      }
    });
  }
}