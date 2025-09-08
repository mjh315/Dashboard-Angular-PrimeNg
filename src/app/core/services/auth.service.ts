// File Path: src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResultDto } from '../models/auth-result.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5111/api/auth';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, { withCredentials: true });
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }



  refreshToken(): Observable<AuthResultDto> {
    // We already added this line, just double-check it's there
    return this.http.post<AuthResultDto>(`${this.apiUrl}/refresh`, {}, { withCredentials: true });
  }

  logout(): void {
    // 2. Make a request to the backend to clear the HttpOnly cookie
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.removeItem('jwt_token');

        // Log out successful on the backend
        console.log('Logout successful on the backend.');
      },
      error: (err) => {
        console.error('Logout failed on the backend:', err);
      }
    });
  }
}