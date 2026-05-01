import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, ClientFilter, Area } from '../../models/client.model';

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private url = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getAll(filter: ClientFilter): Observable<PagedResult<Client>> {
    let params = new HttpParams()
      .set('page', filter.page)
      .set('pageSize', filter.pageSize);
    if (filter.search) params = params.set('search', filter.search);
    if (filter.status) params = params.set('status', filter.status);
    if (filter.areaId) params = params.set('areaId', filter.areaId);
    if (filter.packageId) params = params.set('packageId', filter.packageId);
    return this.http.get<PagedResult<Client>>(this.url, { params });
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.url}/${id}`);
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>(this.url, client);
  }

  update(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.url}/${id}`, client);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  updateStatus(id: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/status`, { status });
  }

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${environment.apiUrl}/areas`);
  }
}