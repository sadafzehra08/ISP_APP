// ── payment-list.ts ── Billing Tracker — Real API ────────────────────────
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ClientBilling, BillingFilter, BillingSummary } from '../../../models/payment.model';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector:    'app-payment-list',
  standalone:  false,
  templateUrl: './payment-list.html',
  styleUrl:    './payment-list.scss',
})
export class PaymentList implements OnInit {

  billings:    ClientBilling[] = [];
  loading      = false;
  totalRecords = 0;
  totalPages   = 0;

  filter: BillingFilter = {
    search:   '',
    month:    new Date().getMonth() + 1,
    year:     new Date().getFullYear(),
    status:   'all',
    page:     1,
    pageSize: 10,
  };

  months = [
    { value: 0,  label: 'All Months'  },
    { value: 1,  label: 'January'     }, { value: 2,  label: 'February'  },
    { value: 3,  label: 'March'       }, { value: 4,  label: 'April'     },
    { value: 5,  label: 'May'         }, { value: 6,  label: 'June'      },
    { value: 7,  label: 'July'        }, { value: 8,  label: 'August'    },
    { value: 9,  label: 'September'   }, { value: 10, label: 'October'   },
    { value: 11, label: 'November'    }, { value: 12, label: 'December'  },
  ];

  years = [2024, 2025, 2026];

  summary: BillingSummary = {
    total: 0, unpaidCount: 0, invoicedCount: 0, paidCount: 0,
    totalAmount: 0, collectedAmount: 0, outstandingAmount: 0,
  };

  showInvoiceModal  = false;
  billingToInvoice: ClientBilling | null = null;
  creatingInvoice   = false;

  showDeleteModal  = false;
  billingToDelete: ClientBilling | null = null;

  searchSubject = new Subject<string>();

  constructor(
    private router:         Router,
    private paymentService: PaymentService,
    private cdr:            ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBillings();
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => { this.filter.page = 1; this.loadBillings(); });
  }

  loadBillings() {
    this.loading = true;

    this.paymentService.getBillings(this.filter).subscribe({
      next: (res) => {
        this.billings     = res.data;
        this.totalRecords = res.totalCount;
        this.totalPages   = res.totalPages;
        this.loading      = false;
        this.loadSummary();
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Billing load error:', e);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSummary() {
    this.paymentService
      .getBillingSummary(
        this.filter.month !== 0 ? this.filter.month : undefined,
        this.filter.year
      )
      .subscribe({
        next: (s) => { this.summary = s; this.cdr.detectChanges(); },
        error: (e) => console.error('Summary error:', e)
      });
  }

  onSearchChange()  { this.searchSubject.next(this.filter.search ?? ''); }
  onFilterChange()  { this.filter.page = 1; this.loadBillings(); }

  setStatus(s: 'all' | 'unpaid' | 'invoiced' | 'paid') {
    this.filter.status = s; this.filter.page = 1; this.loadBillings();
  }

  clearFilters() {
    this.filter = {
      search: '', month: new Date().getMonth() + 1,
      year: new Date().getFullYear(), status: 'all', page: 1, pageSize: 10,
    };
    this.loadBillings();
  }

  get hasFilters() { return !!(this.filter.search || this.filter.status !== 'all'); }
  get pages()      { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) { this.filter.page = p; this.loadBillings(); }
  }

  openInvoiceModal(billing: ClientBilling, e: Event) {
    e.stopPropagation();
    this.billingToInvoice = billing;
    this.showInvoiceModal = true;
  }

  confirmCreateInvoice() {
    if (!this.billingToInvoice) return;
    this.creatingInvoice = true;

    this.paymentService.createInvoice(this.billingToInvoice.id).subscribe({
      next: () => {
        this.creatingInvoice  = false;
        this.showInvoiceModal = false;
        this.billingToInvoice = null;
        this.loadBillings();
      },
      error: (e) => {
        console.error('Create invoice error:', e);
        this.creatingInvoice = false;
      }
    });
  }

  viewInvoice(invoiceId: number, e: Event) {
    e.stopPropagation();
    this.router.navigate(['/invoices', invoiceId]);
  }

  viewReceipt(receiptId: number, e: Event) {
    e.stopPropagation();
    this.router.navigate(['/receipts', receiptId]);
  }

  confirmDelete(billing: ClientBilling, e: Event) {
    e.stopPropagation();
    this.billingToDelete = billing;
    this.showDeleteModal = true;
  }

  deleteConfirmed() {
    this.showDeleteModal = false;
    this.billingToDelete = null;
  }

  isOverdue(billing: ClientBilling): boolean {
    return billing.status === 'unpaid' && new Date(billing.dueDate) < new Date();
  }
}