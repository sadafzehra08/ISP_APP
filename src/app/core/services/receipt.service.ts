// ── core/services/receipt.service.ts ─────────────────────────────────────

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Receipt,
  ReceiptSummary,
  ReceiptFilter,
  PagedReceiptResult,
} from '../../models/receipt.model';

@Injectable({ providedIn: 'root' })
export class ReceiptService {

  private url = `${environment.apiUrl}/receipts`;

  constructor(private http: HttpClient) {}

  // GET /receipts — filter ke saath
  getAll(filter: ReceiptFilter): Observable<PagedReceiptResult> {
    let params = new HttpParams()
      .set('page',     filter.page)
      .set('pageSize', filter.pageSize);

    if (filter.search && filter.search.trim())
      params = params.set('search',   filter.search.trim());
    if (filter.method)
      params = params.set('method',   filter.method);
    if (filter.fromDate)
      params = params.set('fromDate', filter.fromDate);
    if (filter.toDate)
      params = params.set('toDate',   filter.toDate);

    return this.http.get<PagedReceiptResult>(this.url, { params });
  }

  // GET /receipts/summary — stats cards
  getSummary(): Observable<ReceiptSummary> {
    return this.http.get<ReceiptSummary>(`${this.url}/summary`);
  }

  // GET /receipts/:id — single receipt
  getById(id: number): Observable<Receipt> {
    return this.http.get<Receipt>(`${this.url}/${id}`);
  }
}