import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // login(email: string, password: string): Observable<User> {
  //   return this.http.post<User>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
  //     tap(user => {
  //       localStorage.setItem('isp_user', JSON.stringify(user));
  //       this.userSubject.next(user);
  //     })
  //   );
  // }
  login(email: string, password: string): Observable<User> {
 const hardcodedUser: User = {
  id: 1,
  email: "admin@test.com",
  name: "Admin User",
  token: "fake-jwt-token",
  role: "admin",
  isActive: true
};

  return new Observable(observer => {
    if (email === "admin@test.com" && password === "123456") {
      
      localStorage.setItem('isp_user', JSON.stringify(hardcodedUser));
      this.userSubject.next(hardcodedUser);

      observer.next(hardcodedUser);
      observer.complete();
    } else {
      observer.error("Invalid email or password");
    }
  });
}

  logout(): void {
    localStorage.removeItem('isp_user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUser(): User | null { return this.userSubject.value; }
  get token(): string | null { return this.currentUser?.token || null; }
  get isLoggedIn(): boolean { return !!this.currentUser; }
  get userRole(): string { return this.currentUser?.role || ''; }
  get isAdmin(): boolean { return this.userRole === 'admin'; }

  private getStoredUser(): User | null {
    try {
      const d = localStorage.getItem('isp_user');
      return d ? JSON.parse(d) : null;
    } catch { return null; }
  }
}