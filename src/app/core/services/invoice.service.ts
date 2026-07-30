// ── core/services/invoice.service.ts ─────────────────────────────────────

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Invoice,
  InvoiceSummary,
  PagedInvoiceResult,
  InvoiceFilter,
  InvoiceCreateDto,
  MarkPaidDto,
} from '../../models/invoice.model';
import { ClientBilling } from '../../models/payment.model';

export interface MarkPaidResponse {
  invoice:     Invoice;          // updated invoice (status: paid)
  nextBilling: ClientBilling;    // next cycle jo backend ne banaya
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {

  private url = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  // ── GET all invoices — filter + pagination ────────────────────────────
  getAll(filter: InvoiceFilter): Observable<PagedInvoiceResult> {
    let params = new HttpParams()
      .set('page',     filter.page)
      .set('pageSize', filter.pageSize);

    if (filter.search && filter.search.trim())
      params = params.set('search', filter.search.trim());

    if (filter.status && filter.status !== 'all')
      params = params.set('status', filter.status);

    if (filter.fromDate) params = params.set('fromDate', filter.fromDate);
    if (filter.toDate)   params = params.set('toDate',   filter.toDate);

    return this.http.get<PagedInvoiceResult>(this.url, { params });
  }

  // ── GET summary — stats cards ke liye ────────────────────────────────
  getSummary(): Observable<InvoiceSummary> {
    return this.http.get<InvoiceSummary>(`${this.url}/summary`);
  }

  // ── GET single invoice ────────────────────────────────────────────────
  getById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.url}/${id}`);
  }

  // ── POST — invoice create (payment module se billingId aata hai) ──────
  create(dto: InvoiceCreateDto): Observable<Invoice> {
    return this.http.post<Invoice>(this.url, dto);
  }

  // ── PATCH — Mark Paid ─────────────────────────────────────────────────
  // Invoice module ka "Mark Paid" modal submit karta hai yeh
  // Backend: invoice → paid, billing → paid, receipt banta hai, next cycle banta hai
  markPaid(dto: MarkPaidDto): Observable<MarkPaidResponse> {
    return this.http.patch<MarkPaidResponse>(
      `${this.url}/${dto.invoiceId}/pay`,
      dto
    );
  }

  // ── DELETE ────────────────────────────────────────────────────────────
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // ── Overdue check helper ──────────────────────────────────────────────
  static isOverdue(invoice: Invoice): boolean {
    return invoice.status === 'unpaid' &&
      new Date(invoice.dueDate) < new Date();
  }
}
