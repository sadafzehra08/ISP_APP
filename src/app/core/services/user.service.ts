// ── core/services/user.service.ts ────────────────────────────────────────

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AppUser, PagedUserResult, UserFilter,
  UserCreateDto, UserUpdateDto, ChangePasswordDto
} from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(filter: UserFilter): Observable<PagedUserResult> {
    let params = new HttpParams()
      .set('page',     filter.page)
      .set('pageSize', filter.pageSize);
    if (filter.search) params = params.set('search', filter.search);
    if (filter.role)   params = params.set('role',   filter.role);
    return this.http.get<PagedUserResult>(this.url, { params });
  }

  getById(id: number): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.url}/${id}`);
  }

  create(dto: UserCreateDto): Observable<AppUser> {
    return this.http.post<AppUser>(this.url, dto);
  }

  update(id: number, dto: UserUpdateDto): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.url}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  changePassword(id: number, dto: ChangePasswordDto): Observable<any> {
    return this.http.patch(`${this.url}/${id}/password`, dto);
  }

  toggleStatus(id: number): Observable<any> {
    return this.http.patch(`${this.url}/${id}/toggle-status`, {});
  }
}
