// ── core/services/payment.service.ts ─────────────────────────────────────

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ClientBilling,
  BillingCreateDto,
  BillingFilter,
  BillingSummary,
} from '../../models/payment.model';
import { Invoice }  from '../../models/invoice.model';
import { environment } from '../../../environments/environment';
//import { Receipt }  from '../../models/receipt.model';

export interface BillingListResponse {
  data:       ClientBilling[];
  totalCount: number;
  totalPages: number;
  page:       number;
  pageSize:   number;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
private api = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // ── BILLING TRACKER ────────────────────────────────────────────────────

  // Payment module: filtered billing list
getBillings(filter: BillingFilter): Observable<BillingListResponse> {
  let params = new HttpParams()
    .set('page',     filter.page)
    .set('pageSize', filter.pageSize);

  if (filter.search && filter.search.trim())
    params = params.set('search', filter.search.trim());

  // ← month 0 hone pe mat bhejo
  if (filter.month && filter.month !== 0)
    params = params.set('month', filter.month);

  if (filter.year)
    params = params.set('year', filter.year);

  if (filter.status && filter.status !== 'all')
    params = params.set('status', filter.status);

  return this.http.get<BillingListResponse>(`${this.api}/billings`, { params });
}

  // Summary cards ke liye
  getBillingSummary(month?: number, year?: number): Observable<BillingSummary> {
    let params = new HttpParams();
    if (month && month !== 0) params = params.set('month', month);
    if (year)                 params = params.set('year',  year);
    return this.http.get<BillingSummary>(`${this.api}/billings/summary`, { params });
  }

  // Single billing detail
  getBillingById(id: number): Observable<ClientBilling> {
    return this.http.get<ClientBilling>(`${this.api}/billings/${id}`);
  }

  // Jab client create ho — first billing cycle auto-create
  createBilling(dto: BillingCreateDto): Observable<ClientBilling> {
    return this.http.post<ClientBilling>(`${this.api}/billings`, dto);
  }

  // ── INVOICE ────────────────────────────────────────────────────────────

  // "Create Invoice" button click — billing: unpaid → invoiced
  createInvoice(billingId: number): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.api}/invoices`, { billingId });
  }

  // ── RECEIPT / MARK PAID ────────────────────────────────────────────────

  // Invoice module ka "Mark Paid" button
  // billing: invoiced → paid
  // receipt record banta hai
  // backend next cycle auto-create karta hai
//   markInvoicePaid(payload: {
//     invoiceId:     number;
//     paymentMethod: 'cash' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cheque' | 'online';
//     transactionId?: string;
//     paidDate:      string;
//     notes?:        string;
//   }): Observable<{ receipt: Receipt; nextBilling: ClientBilling }> {
//     return this.http.patch<any>(
//       `${this.api}/invoices/${payload.invoiceId}/pay`,
//       payload
//     );
//   }
markInvoicePaid(payload: {
  invoiceId:      number;
  paymentMethod:  'cash' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cheque' | 'online';
  transactionId?: string;
  paidDate:       string;
  notes?:         string;
}): Observable<any> {   // ← any kar do abhi
  return this.http.patch<any>(
    `${this.api}/invoices/${payload.invoiceId}/pay`,
    payload
  );
}

  // ── HELPERS ────────────────────────────────────────────────────────────

  // connection_date se billing period calculate karna
  // Client service mein bhi use hoga jab client save ho
  static calcPeriod(connectionDate: string): { periodStart: string; periodEnd: string } {
    const start = new Date(connectionDate);
    const end   = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(end.getDate() - 1);   // ek din peeche

    return {
      periodStart: start.toISOString().split('T')[0],  // '2025-05-23'
      periodEnd:   end.toISOString().split('T')[0],    // '2025-06-22'
    };
  }

  // Next cycle dates — Mark Paid ke baad backend call karta hai
  static calcNextPeriod(currentEnd: string): { periodStart: string; periodEnd: string } {
    const start = new Date(currentEnd);
    start.setDate(start.getDate() + 1);  // current end + 1

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(end.getDate() - 1);

    return {
      periodStart: start.toISOString().split('T')[0],
      periodEnd:   end.toISOString().split('T')[0],
    };
  }
}