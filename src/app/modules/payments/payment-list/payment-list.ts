

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Payment } from '../../../models/payment.model';

@Component({
  selector: 'app-payment-list',
  standalone: false,
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.scss',
})
export class PaymentList implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  searchText = '';
  filterMethod = '';
  filterStatus = '';
  filterMonth = '';
  page = 1;
  pageSize = 10;
  totalPages = 0;
  selectedPayments: Set<number> = new Set();

  showDeleteModal = false;
  showReceiptModal = false;
  paymentToDelete: Payment | null = null;
  receiptPayment: Payment | null = null;

  searchSubject = new Subject<string>();
methodList = [
  { key: 'cash',          label: 'Cash',          icon: '💵' },
  { key: 'jazzcash',      label: 'JazzCash',       icon: '📱' },
  { key: 'easypaisa',     label: 'Easypaisa',      icon: '📲' },
  { key: 'bank_transfer', label: 'Bank Transfer',  icon: '🏦' },
  { key: 'cheque',        label: 'Cheque',         icon: '📄' },
  { key: 'online',        label: 'Online',         icon: '💻' },
];
  mockPayments: Payment[] = [
    { id: 1, paymentNo: 'PAY-2025-0001', clientId: 1, clientName: 'Ahmed Raza', clientCode: 'NP-0001', clientPhone: '0300-1234567', invoiceId: 1, invoiceNo: 'INV-2025-0001', amount: 1200, method: 'cash', status: 'completed', paymentDate: '2025-05-03', receivedBy: 'Admin', packageName: '10 Mbps Basic', areaName: 'Gulshan-e-Iqbal' },
    { id: 2, paymentNo: 'PAY-2025-0002', clientId: 2, clientName: 'Sara Khan', clientCode: 'NP-0002', clientPhone: '0311-2345678', invoiceId: 2, invoiceNo: 'INV-2025-0002', amount: 2000, method: 'jazzcash', status: 'completed', paymentDate: '2025-05-04', receivedBy: 'Admin', transactionId: 'JZ-9981234', packageName: '25 Mbps Premium', areaName: 'DHA Phase 2' },
    { id: 3, paymentNo: 'PAY-2025-0003', clientId: 3, clientName: 'Ali Hassan', clientCode: 'NP-0003', clientPhone: '0321-3456789', invoiceId: 3, invoiceNo: 'INV-2025-0003', amount: 600, method: 'easypaisa', status: 'completed', paymentDate: '2025-04-10', receivedBy: 'Admin', transactionId: 'EP-4567890', packageName: '10 Mbps Basic', areaName: 'PECHS' },
    { id: 4, paymentNo: 'PAY-2025-0004', clientId: 5, clientName: 'Usman Tariq', clientCode: 'NP-0005', clientPhone: '0345-5678901', invoiceId: 5, invoiceNo: 'INV-2025-0005', amount: 2200, method: 'bank_transfer', status: 'completed', paymentDate: '2025-05-02', receivedBy: 'Admin', transactionId: 'BT-1122334', packageName: '25 Mbps Premium', areaName: 'Clifton' },
    { id: 5, paymentNo: 'PAY-2025-0005', clientId: 7, clientName: 'Bilal Chaudhry', clientCode: 'NP-0007', clientPhone: '0312-7890123', invoiceId: 7, invoiceNo: 'INV-2025-0007', amount: 3000, method: 'jazzcash', status: 'completed', paymentDate: '2025-04-05', receivedBy: 'Admin', transactionId: 'JZ-7654321', packageName: '50 Mbps Ultra', areaName: 'Gulshan-e-Iqbal' },
    { id: 6, paymentNo: 'PAY-2025-0006', clientId: 4, clientName: 'Zara Malik', clientCode: 'NP-0004', clientPhone: '0333-4567890', invoiceId: 4, invoiceNo: 'INV-2025-0004', amount: 3500, method: 'cash', status: 'pending', paymentDate: '2025-05-06', receivedBy: 'Admin', packageName: '50 Mbps Ultra', areaName: 'North Nazimabad' },
    { id: 7, paymentNo: 'PAY-2025-0007', clientId: 6, clientName: 'Fatima Shah', clientCode: 'NP-0006', clientPhone: '0322-6789012', invoiceId: 6, invoiceNo: 'INV-2025-0006', amount: 1200, method: 'online', status: 'failed', paymentDate: '2025-05-05', receivedBy: 'Admin', transactionId: 'ON-FAIL-999', packageName: '10 Mbps Basic', areaName: 'North Nazimabad' },
    { id: 8, paymentNo: 'PAY-2025-0008', clientId: 8, clientName: 'Hina Baig', clientCode: 'NP-0008', clientPhone: '0301-8901234', invoiceId: 8, invoiceNo: 'INV-2025-0008', amount: 2200, method: 'cheque', status: 'refunded', paymentDate: '2025-03-15', receivedBy: 'Admin', transactionId: 'CHQ-112233', packageName: '25 Mbps Premium', areaName: 'Malir' },
    { id: 9, paymentNo: 'PAY-2025-0009', clientId: 1, clientName: 'Ahmed Raza', clientCode: 'NP-0001', clientPhone: '0300-1234567', invoiceId: 9, invoiceNo: 'INV-2025-0009', amount: 1200, method: 'cash', status: 'completed', paymentDate: '2025-04-03', receivedBy: 'Admin', packageName: '10 Mbps Basic', areaName: 'Gulshan-e-Iqbal' },
    { id: 10, paymentNo: 'PAY-2025-0010', clientId: 2, clientName: 'Sara Khan', clientCode: 'NP-0002', clientPhone: '0311-2345678', invoiceId: 10, invoiceNo: 'INV-2025-0010', amount: 2000, method: 'easypaisa', status: 'completed', paymentDate: '2025-04-04', receivedBy: 'Admin', transactionId: 'EP-1234567', packageName: '25 Mbps Premium', areaName: 'DHA Phase 2' },
    { id: 11, paymentNo: 'PAY-2025-0011', clientId: 3, clientName: 'Ali Hassan', clientCode: 'NP-0003', clientPhone: '0321-3456789', invoiceId: 11, invoiceNo: 'INV-2025-0011', amount: 1200, method: 'cash', status: 'completed', paymentDate: '2025-03-05', receivedBy: 'Admin', packageName: '10 Mbps Basic', areaName: 'PECHS' },
    { id: 12, paymentNo: 'PAY-2025-0012', clientId: 5, clientName: 'Usman Tariq', clientCode: 'NP-0005', clientPhone: '0345-5678901', invoiceId: 12, invoiceNo: 'INV-2025-0012', amount: 2200, method: 'bank_transfer', status: 'completed', paymentDate: '2025-03-02', receivedBy: 'Admin', transactionId: 'BT-9988776', packageName: '25 Mbps Premium', areaName: 'Clifton' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.applyFilters();
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => { this.page = 1; this.applyFilters(); });
  }

  applyFilters() {
    let data = [...this.mockPayments];
    if (this.searchText) {
      const s = this.searchText.toLowerCase();
      data = data.filter(p =>
        p.clientName?.toLowerCase().includes(s) ||
        p.paymentNo?.toLowerCase().includes(s) ||
        p.clientCode?.toLowerCase().includes(s) ||
        p.transactionId?.toLowerCase().includes(s) ||
        p.invoiceNo?.toLowerCase().includes(s)
      );
    }
    if (this.filterMethod) data = data.filter(p => p.method === this.filterMethod);
    if (this.filterStatus) data = data.filter(p => p.status === this.filterStatus);
    if (this.filterMonth) data = data.filter(p => p.paymentDate?.startsWith(this.filterMonth));

    this.totalPages = Math.ceil(data.length / this.pageSize);
    const start = (this.page - 1) * this.pageSize;
    this.filteredPayments = data.slice(start, start + this.pageSize);
  }


getMethodCount(method: string): number {
  return this.mockPayments.filter(p => p.method === method).length;
}
  onSearchChange() { this.searchSubject.next(this.searchText); }
  clearFilters() { this.searchText = ''; this.filterMethod = ''; this.filterStatus = ''; this.filterMonth = ''; this.page = 1; this.applyFilters(); }
  get hasFilters() { return !!(this.searchText || this.filterMethod || this.filterStatus || this.filterMonth); }
  get pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  goToPage(p: number) { if (p >= 1 && p <= this.totalPages) { this.page = p; this.applyFilters(); } }

  viewPayment(id: number) { this.router.navigate(['/payments', id]); }
  editPayment(id: number, e: Event) { e.stopPropagation(); this.router.navigate(['/payments', id, 'edit']); }

  openReceipt(p: Payment, e: Event) { e.stopPropagation(); this.receiptPayment = p; this.showReceiptModal = true; }
  printReceipt() { window.print(); }

  confirmDelete(p: Payment, e: Event) { e.stopPropagation(); this.paymentToDelete = p; this.showDeleteModal = true; }
  deleteConfirmed() {
    if (this.paymentToDelete) this.mockPayments = this.mockPayments.filter(p => p.id !== this.paymentToDelete!.id);
    this.showDeleteModal = false; this.paymentToDelete = null; this.applyFilters();
  }

  toggleSelect(id: number) {
    if (this.selectedPayments.has(id)) this.selectedPayments.delete(id);
    else this.selectedPayments.add(id);
  }
  toggleAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) this.filteredPayments.forEach(p => this.selectedPayments.add(p.id!));
    else this.selectedPayments.clear();
  }
  get allSelected() { return this.filteredPayments.length > 0 && this.filteredPayments.every(p => this.selectedPayments.has(p.id!)); }

  getMethodIcon(method: string): string {
    const icons: any = { cash: '💵', jazzcash: '📱', easypaisa: '📲', bank_transfer: '🏦', cheque: '📄', online: '💻' };
    return icons[method] || '💳';
  }
  getMethodLabel(method: string): string {
    const labels: any = { cash: 'Cash', jazzcash: 'JazzCash', easypaisa: 'Easypaisa', bank_transfer: 'Bank Transfer', cheque: 'Cheque', online: 'Online' };
    return labels[method] || method;
  }

  get stats() {
    const all = this.mockPayments;
    return {
      total: all.length,
      completed: all.filter(p => p.status === 'completed').length,
      pending: all.filter(p => p.status === 'pending').length,
      failed: all.filter(p => p.status === 'failed').length,
      refunded: all.filter(p => p.status === 'refunded').length,
      totalCollected: all.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0),
      cashTotal: all.filter(p => p.method === 'cash' && p.status === 'completed').reduce((s, p) => s + p.amount, 0),
      digitalTotal: all.filter(p => p.method !== 'cash' && p.status === 'completed').reduce((s, p) => s + p.amount, 0),
    };
  }
}