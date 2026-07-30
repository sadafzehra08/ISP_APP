// ── core/services/package.service.ts ──────────────────────────────────────

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Package } from '../../models/package.model';

@Injectable({ providedIn: 'root' })
export class PackageService {

  private url = `${environment.apiUrl}/packages`;

  constructor(private http: HttpClient) {}

  // GET /packages?status=active|inactive
getAll(status?: 'active' | 'inactive'): Observable<Package[]> {
  return this.http.get<Package[]>(this.url, {
    params: status ? { status } : undefined
  });
}
  // GET /packages/:id
  getById(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.url}/${id}`);
  }

  // POST /packages
  create(dto: Partial<Package>): Observable<Package> {
    return this.http.post<Package>(this.url, dto);
  }

  // PUT /packages/:id
  update(id: number, dto: Partial<Package>): Observable<Package> {
    return this.http.put<Package>(`${this.url}/${id}`, dto);
  }

  // DELETE /packages/:id
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // PATCH /packages/:id/toggle
  toggleStatus(id: number): Observable<Package> {
    return this.http.patch<Package>(`${this.url}/${id}/toggle`, {});
  }
}