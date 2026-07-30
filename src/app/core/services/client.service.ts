import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Client,
  ClientCreateDto,
  ClientUpdateDto,
  ClientFilter,
  Area,
  Package,
  PagedResult
} from '../../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private url = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  // GET all — filters + pagination
  getAll(filter: ClientFilter): Observable<PagedResult<Client>> {
    let params = new HttpParams()
      .set('page',     filter.page)
      .set('pageSize', filter.pageSize);

    if (filter.search)    params = params.set('search',    filter.search);
    if (filter.status)    params = params.set('status',    filter.status);
    if (filter.areaId)    params = params.set('areaId',    filter.areaId);
    if (filter.packageId) params = params.set('packageId', filter.packageId);

    return this.http.get<PagedResult<Client>>(this.url, { params });
  }

  // GET single
  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.url}/${id}`);
  }

  // POST — ClientCreateDto use karo (userId backend set karega)
  create(dto: ClientCreateDto): Observable<Client> {
    return this.http.post<Client>(this.url, dto);
  }

  // PUT — ClientUpdateDto use karo
  update(id: number, dto: ClientUpdateDto): Observable<Client> {
    return this.http.put<Client>(`${this.url}/${id}`, dto);
  }

  // DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // PATCH — status only update
  updateStatus(id: number, status: string): Observable<Client> {
    return this.http.patch<Client>(`${this.url}/${id}/status`, { status });
  }

  // GET areas dropdown — URL fix kiya (/clients/areas)
  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.url}/areas`);
  }

  // GET packages dropdown — naya add kiya
  getPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.url}/packages`);
  }
}