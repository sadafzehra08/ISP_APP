// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-receipt-list',
//   standalone: false,
//   templateUrl: './receipt-list.html',
//   styleUrl: './receipt-list.scss',
// })
// export class ReceiptList {}


// ── receipt-list.ts ───────────────────────────────────────────────────────
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Receipt, ReceiptFilter, ReceiptSummary } from '../../../models/receipt.model';
import { ReceiptService } from '../../../core/services/receipt.service';

@Component({
  selector:    'app-receipt-list',
  standalone:  false,
  templateUrl: './receipt-list.html',
  styleUrl:    './receipt-list.scss',
})
export class ReceiptList implements OnInit {

  receipts:    Receipt[] = [];
  loading      = false;
  totalRecords = 0;
  totalPages   = 0;

  filter: ReceiptFilter = {
    search: '', method: '', fromDate: '', toDate: '',
    page: 1, pageSize: 10,
  };

  summary: ReceiptSummary = {
    total: 0, totalCollected: 0, cashAmount: 0, digitalAmount: 0,
  };

  // Print modal
  showPrintModal  = false;
  receiptToPrint: Receipt | null = null;

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
    private receiptService: ReceiptService,
    private cdr:            ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadReceipts();
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => { this.filter.page = 1; this.loadReceipts(); });
  }

  loadReceipts() {
    this.loading = true;

    this.receiptService.getAll(this.filter).subscribe({
      next: (res) => {
        this.receipts     = res.data;
        this.totalRecords = res.totalCount;
        this.totalPages   = res.totalPages;
        this.loading      = false;
        this.loadSummary();
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Receipt load error:', e);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSummary() {
    this.receiptService.getSummary().subscribe({
      next: (s) => { this.summary = s; this.cdr.detectChanges(); },
      error: (e) => console.error('Summary error:', e)
    });
  }

  onSearchChange() { this.searchSubject.next(this.filter.search ?? ''); }
  onFilterChange() { this.filter.page = 1; this.loadReceipts(); }

  clearFilters() {
    this.filter = { search: '', method: '', fromDate: '', toDate: '', page: 1, pageSize: 10 };
    this.loadReceipts();
  }

  get hasFilters() {
    return !!(this.filter.search || this.filter.method || this.filter.fromDate || this.filter.toDate);
  }

  get pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) { this.filter.page = p; this.loadReceipts(); }
  }

  // Print modal
  openPrint(receipt: Receipt, e: Event) {
    e.stopPropagation();
    this.receiptToPrint = receipt;
    this.showPrintModal = true;
  }

  printReceipt() { window.print(); }

  getMethodLabel(method: string): string {
    const m = this.paymentMethods.find(x => x.val === method);
    return m ? `${m.icon} ${m.label}` : method;
  }
}