import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginReqDto, RefreshTokenReqDto, RegisterReqDto } from '../../models/ath.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  get isLoggedIn(): Observable<boolean> {
    return this.authSubject.asObservable();
  }

  login(credentials: LoginReqDto): Observable<RefreshTokenReqDto> {
    return this.http.post<RefreshTokenReqDto>(`${this.apiUrl}/Auth/login`, credentials).pipe(
      tap(response => {
        this.saveTokens(response);
        this.authSubject.next(true);
      })
    );
  }

  register(userData: RegisterReqDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/register`, userData);
  }

  refreshToken(tokens: RefreshTokenReqDto): Observable<RefreshTokenReqDto> {
    return this.http.post<RefreshTokenReqDto>(`${this.apiUrl}/Auth/refresh`, tokens).pipe(
      tap(response => {
        this.saveTokens(response);
        this.authSubject.next(true);
      })
    );
  }

  private saveTokens(response: RefreshTokenReqDto): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.authSubject.next(false);
  }
}