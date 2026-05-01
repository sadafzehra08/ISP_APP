
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Invoice } from '../../../models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  standalone: false,
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.scss',
})
export class InvoiceList implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];

  searchText = '';
  filterStatus = '';
  filterMonth = '';
  page = 1;
  pageSize = 10;
  totalPages = 0;

  showPaymentModal = false;
  invoiceToPay: Invoice | null = null;
  paymentAmount = 0;
  paymentMethod = 'cash';
  paymentDate = new Date().toISOString().split('T')[0];

  mockInvoices: Invoice[] = [
    { id: 1, invoiceNo: 'INV-2025-0001', clientId: 1, clientName: 'Ahmed Raza', clientCode: 'NP-0001', clientPhone: '0300-1234567', packageName: '10 Mbps Basic', areaName: 'Gulshan-e-Iqbal', amount: 1200, tax: 0, discount: 0, totalAmount: 1200, amountPaid: 1200, balance: 0, status: 'paid', issueDate: '2025-05-01', dueDate: '2025-05-07', paymentDate: '2025-05-03', paymentMethod: 'cash' },
    { id: 2, invoiceNo: 'INV-2025-0002', clientId: 2, clientName: 'Sara Khan', clientCode: 'NP-0002', clientPhone: '0311-2345678', packageName: '25 Mbps Premium', areaName: 'DHA Phase 2', amount: 2200, tax: 0, discount: 200, totalAmount: 2000, amountPaid: 0, balance: 2000, status: 'unpaid', issueDate: '2025-05-01', dueDate: '2025-05-07' },
    { id: 3, invoiceNo: 'INV-2025-0003', clientId: 3, clientName: 'Ali Hassan', clientCode: 'NP-0003', clientPhone: '0321-3456789', packageName: '10 Mbps Basic', areaName: 'PECHS', amount: 1200, tax: 0, discount: 0, totalAmount: 1200, amountPaid: 600, balance: 600, status: 'partial', issueDate: '2025-04-01', dueDate: '2025-04-07', paymentDate: '2025-04-10', paymentMethod: 'easypaisa' },
    { id: 4, invoiceNo: 'INV-2025-0004', clientId: 4, clientName: 'Zara Malik', clientCode: 'NP-0004', clientPhone: '0333-4567890', packageName: '50 Mbps Ultra', areaName: 'North Nazimabad', amount: 3500, tax: 0, discount: 0, totalAmount: 3500, amountPaid: 0, balance: 3500, status: 'overdue', issueDate: '2025-04-01', dueDate: '2025-04-07' },
    { id: 5, invoiceNo: 'INV-2025-0005', clientId: 5, clientName: 'Usman Tariq', clientCode: 'NP-0005', clientPhone: '0345-5678901', packageName: '25 Mbps Premium', areaName: 'Clifton', amount: 2200, tax: 0, discount: 0, totalAmount: 2200, amountPaid: 2200, balance: 0, status: 'paid', issueDate: '2025-05-01', dueDate: '2025-05-07', paymentDate: '2025-05-02', paymentMethod: 'bank_transfer' },
    { id: 6, invoiceNo: 'INV-2025-0006', clientId: 6, clientName: 'Fatima Shah', clientCode: 'NP-0006', clientPhone: '0322-6789012', packageName: '10 Mbps Basic', areaName: 'North Nazimabad', amount: 1200, tax: 0, discount: 0, totalAmount: 1200, amountPaid: 0, balance: 1200, status: 'unpaid', issueDate: '2025-05-01', dueDate: '2025-05-07' },
    { id: 7, invoiceNo: 'INV-2025-0007', clientId: 7, clientName: 'Bilal Chaudhry', clientCode: 'NP-0007', clientPhone: '0312-7890123', packageName: '50 Mbps Ultra', areaName: 'Gulshan-e-Iqbal', amount: 3500, tax: 0, discount: 500, totalAmount: 3000, amountPaid: 3000, balance: 0, status: 'paid', issueDate: '2025-04-01', dueDate: '2025-04-07', paymentDate: '2025-04-05', paymentMethod: 'jazzcash' },
    { id: 8, invoiceNo: 'INV-2025-0008', clientId: 8, clientName: 'Hina Baig', clientCode: 'NP-0008', clientPhone: '0301-8901234', packageName: '25 Mbps Premium', areaName: 'Malir', amount: 2200, tax: 0, discount: 0, totalAmount: 2200, amountPaid: 0, balance: 2200, status: 'overdue', issueDate: '2025-03-01', dueDate: '2025-03-07' },
  ];

  constructor(private router: Router) {}

  ngOnInit() { this.applyFilters(); }

  applyFilters() {
    let data = [...this.mockInvoices];
    if (this.searchText) {
      const s = this.searchText.toLowerCase();
      data = data.filter(i =>
        i.clientName?.toLowerCase().includes(s) ||
        i.invoiceNo?.toLowerCase().includes(s) ||
        i.clientCode?.toLowerCase().includes(s)
      );
    }
    if (this.filterStatus) data = data.filter(i => i.status === this.filterStatus);
    if (this.filterMonth) data = data.filter(i => i.issueDate?.startsWith(this.filterMonth));

    this.totalPages = Math.ceil(data.length / this.pageSize);
    const start = (this.page - 1) * this.pageSize;
    this.filteredInvoices = data.slice(start, start + this.pageSize);
  }

  clearFilters() { this.searchText = ''; this.filterStatus = ''; this.filterMonth = ''; this.page = 1; this.applyFilters(); }
  get hasFilters() { return !!(this.searchText || this.filterStatus || this.filterMonth); }

  get pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  goToPage(p: number) { if (p >= 1 && p <= this.totalPages) { this.page = p; this.applyFilters(); } }

  viewInvoice(id: number) { this.router.navigate(['/invoices', id]); }
  editInvoice(id: number, e: Event) { e.stopPropagation(); this.router.navigate(['/invoices', id, 'edit']); }

  openPaymentModal(inv: Invoice, e: Event) {
    e.stopPropagation();
    this.invoiceToPay = inv;
    this.paymentAmount = inv.balance || 0;
    this.paymentMethod = 'cash';
    this.paymentDate = new Date().toISOString().split('T')[0];
    this.showPaymentModal = true;
  }

  recordPayment() {
    if (!this.invoiceToPay) return;
    const inv = this.mockInvoices.find(i => i.id === this.invoiceToPay!.id);
    if (inv) {
      inv.amountPaid = (inv.amountPaid || 0) + this.paymentAmount;
      inv.balance = (inv.totalAmount || 0) - inv.amountPaid;
      inv.status = inv.balance <= 0 ? 'paid' : 'partial';
      inv.paymentDate = this.paymentDate;
      inv.paymentMethod = this.paymentMethod;
    }
    this.showPaymentModal = false;
    this.invoiceToPay = null;
    this.applyFilters();
  }

  get summaryStats() {
    const all = this.mockInvoices;
    return {
      total: all.length,
      paid: all.filter(i => i.status === 'paid').length,
      unpaid: all.filter(i => i.status === 'unpaid').length,
      overdue: all.filter(i => i.status === 'overdue').length,
      totalAmount: all.reduce((s, i) => s + (i.totalAmount || 0), 0),
      collected: all.reduce((s, i) => s + (i.amountPaid || 0), 0),
      outstanding: all.reduce((s, i) => s + (i.balance || 0), 0),
    };
  }

  isOverdue(inv: Invoice): boolean {
    return inv.status !== 'paid' && new Date(inv.dueDate) < new Date();
  }
}