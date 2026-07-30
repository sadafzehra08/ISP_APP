import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, UserDto } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  private _user = new BehaviorSubject<UserDto | null>(this.getUserFromStorage());
  user$ = this._user.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ── LOGIN ──
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(res => {
        localStorage.setItem('token',        res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('expiresAt',    res.expiresAt);
        localStorage.setItem('user',         JSON.stringify(res.user));
        this._user.next(res.user);
      })
    );
  }

  // ── LOGOUT ──
  // localStorage poori clear karo aur login page pe reroute karo
  logout(): void {
    localStorage.clear();
    this._user.next(null);
    this.router.navigate(['/login']);
  }

  // ── TOKEN ──
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('expiresAt');
    if (!expiresAt) return true;
    return new Date(expiresAt) < new Date();
  }

  getCurrentUser(): UserDto | null {
    return this._user.value;
  }

  hasRole(role: string): boolean {
    return this._user.value?.role === role;
  }

  private getUserFromStorage(): UserDto | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  get userRole(): string {
    return this._user.value?.role || '';
  }

  // ── Viewer role write-access check ──────────────────────────
  // false = viewer hai, koi add/edit/delete ka button nahi dikhna chahiye
  get canEdit(): boolean {
    return this.userRole.toLowerCase() !== 'viewer';
  }

  get isViewer(): boolean {
    return this.userRole.toLowerCase() === 'viewer';
  }

  get token(): string | null {
    return this.getToken();
  }
}