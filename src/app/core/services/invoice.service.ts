import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Invoice } from '../../models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private url = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  getAll(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.clientId) params = params.set('clientId', filters.clientId);
    if (filters?.month) params = params.set('month', filters.month);
    return this.http.get(this.url, { params });
  }

  getById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.url}/${id}`);
  }

  create(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.url, invoice);
  }

  bulkGenerate(month: string): Observable<any> {
    return this.http.post(`${this.url}/bulk-generate`, { month });
  }

  updateStatus(id: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/status`, { status });
  }

  getByClient(clientId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.url}/client/${clientId}`);
  }
}