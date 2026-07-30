// ── invoice-list.ts ── Real API ───────────────────────────────────────────
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Invoice, InvoiceSummary, InvoiceFilter, MarkPaidDto } from '../../../models/invoice.model';
import { InvoiceService } from '../../../core/services/invoice.service';

@Component({
  selector:    'app-invoice-list',
  standalone:  false,
  templateUrl: './invoice-list.html',
  styleUrl:    './invoice-list.scss',
})
export class InvoiceList implements OnInit {

  invoices: Invoice[] = [];
  summary:  InvoiceSummary = {
    total: 0, unpaidCount: 0, overdueCount: 0,
    paidCount: 0, totalOutstanding: 0, totalCollected: 0,
  };

  loading     = false;
  markingPaid = false;

  filter: InvoiceFilter = {
    search: '', status: 'all', page: 1, pageSize: 10,
  };
  fromDate = '';
  toDate   = '';

  totalRecords = 0;
  totalPages   = 0;

  // Mark Paid Modal
  showMarkPaidModal   = false;
  invoiceToPay:       Invoice | null = null;
  paidMethod:         'cash' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cheque' | 'online' = 'cash';
  paidTransactionId   = '';
  paidDate            = new Date().toISOString().split('T')[0];
  paidNotes           = '';

  paymentMethods = [
    { val: 'cash',          icon: '💵', label: 'Cash'          },
    { val: 'jazzcash',      icon: '📱', label: 'JazzCash'      },
    { val: 'easypaisa',     icon: '📲', label: 'Easypaisa'     },
    { val: 'bank_transfer', icon: '🏦', label: 'Bank Transfer' },
    { val: 'cheque',        icon: '📄', label: 'Cheque'        },
    { val: 'online',        icon: '💻', label: 'Online'        },
  ];

  searchSubject = new Subject<string>();

  constructor(
    private router:         Router,
    private invoiceService: InvoiceService,
    private cdr:            ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadInvoices();
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => { this.filter.page = 1; this.loadInvoices(); });
  }

  // ── Load ──────────────────────────────────────────────────────────────
  loadInvoices() {
    this.loading = true;

    const f: InvoiceFilter = {
      ...this.filter,
      fromDate: this.fromDate || undefined,
      toDate:   this.toDate   || undefined,
    };

    this.invoiceService.getAll(f).subscribe({
      next: (res) => {
        this.invoices     = res.data;
        this.totalRecords = res.totalCount;
        this.totalPages   = res.totalPages;
        this.loading      = false;
        this.loadSummary();
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Invoice load error:', e);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSummary() {
    this.invoiceService.getSummary().subscribe({
      next: (s) => { this.summary = s; this.cdr.detectChanges(); },
      error: (e) => console.error('Summary error:', e)
    });
  }

  // ── Filters ───────────────────────────────────────────────────────────
  onSearchChange() { this.searchSubject.next(this.filter.search ?? ''); }
  onFilterChange() { this.filter.page = 1; this.loadInvoices(); }

  setStatus(s: 'all' | 'unpaid' | 'overdue' | 'paid') {
    this.filter.status = s; this.filter.page = 1; this.loadInvoices();
  }

  clearFilters() {
    this.filter   = { search: '', status: 'all', page: 1, pageSize: 10 };
    this.fromDate = '';
    this.toDate   = '';
    this.loadInvoices();
  }

  get hasFilters(): boolean {
    return !!(this.filter.search || this.filter.status !== 'all' || this.fromDate || this.toDate);
  }

  get pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) { this.filter.page = p; this.loadInvoices(); }
  }

  // ── Mark Paid Modal ───────────────────────────────────────────────────
  openMarkPaid(inv: Invoice, e: Event) {
    e.stopPropagation();
    this.invoiceToPay      = inv;
    this.paidMethod        = 'cash';
    this.paidTransactionId = '';
    this.paidDate          = new Date().toISOString().split('T')[0];
    this.paidNotes         = '';
    this.showMarkPaidModal = true;
  }

  get showTxnField(): boolean {
    return ['jazzcash', 'easypaisa', 'bank_transfer', 'cheque', 'online']
      .includes(this.paidMethod);
  }

  confirmMarkPaid() {
    if (!this.invoiceToPay) return;
    this.markingPaid = true;

    const dto: MarkPaidDto = {
      invoiceId:     this.invoiceToPay.id,
      paymentMethod: this.paidMethod,
      transactionId: this.paidTransactionId || undefined,
      paidDate:      this.paidDate,
      notes:         this.paidNotes || undefined,
    };

    this.invoiceService.markPaid(dto).subscribe({
      next: () => {
        this.markingPaid       = false;
        this.showMarkPaidModal = false;
        this.invoiceToPay      = null;
        this.loadInvoices();
        // TODO: receipt module banne ke baad yahan navigate karna hai
          // this.router.navigate(['/receipts', res.receipt.id]);
      },
      error: (e) => {
        console.error('Mark paid error:', e);
        this.markingPaid = false;
      }
    });
  }

  // ── Navigation ─────────────────────────────────────────────────────────
  viewReceipt(receiptId: number, e: Event) {
    e.stopPropagation();
    this.router.navigate(['/receipts', receiptId]);
  }

  isOverdue(inv: Invoice): boolean {
    return inv.status === 'unpaid' && new Date(inv.dueDate) < new Date();
  }
}