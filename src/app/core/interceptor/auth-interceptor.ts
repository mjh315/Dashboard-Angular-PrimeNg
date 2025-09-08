// File Path: src/app/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

function addToken(request: HttpRequest<unknown>, token: string) {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService, router: Router): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    // This part of the code needs a bit more work to handle a global state for 'isRefreshing'
    // For now, let's keep it simple.
    
    return authService.refreshToken().pipe(
      switchMap((authResult) => {
        authService.saveToken(authResult.token);
        return next(addToken(request, authResult.token));
      }),
      catchError((err) => {
        authService.logout();
        router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addToken(request, token)))
    );
  }
}