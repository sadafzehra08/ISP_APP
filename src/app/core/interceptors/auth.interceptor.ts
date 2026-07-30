import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Login request pe token mat lagao
    if (req.url.includes('/auth/login')) {
      return next.handle(req);
    }

    const token = this.authService.getToken();

    // ✅ FIX: Token expired hone par BLOCK mat karo
    // Backend 401 dega — wahan handle hoga
    // Token header mein add karo (expired ho ya na ho)
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        // 401 — token invalid ya expire — tab logout karo
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        // 403 — permission nahi
        if (error.status === 403) {
          this.router.navigate(['/dashboard']);
        }

        return throwError(() => error);
      })
    );
  }
}