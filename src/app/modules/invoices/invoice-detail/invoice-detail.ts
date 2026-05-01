// import { Component } from '@angular/core';


// export class InvoiceDetail {}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice } from '../../../models/invoice.model';

@Component({
  selector: 'app-invoice-detail',
  standalone: false,
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.scss',
})
export class InvoiceDetail implements OnInit {
  invoice!: Invoice;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.invoice = {
      id: 1, invoiceNo: 'INV-2025-0001', clientId: 1, clientName: 'Ahmed Raza',
      clientCode: 'NP-0001', clientPhone: '0300-1234567',
      clientAddress: 'House 12, Block A, Gulshan-e-Iqbal, Karachi',
      packageName: '10 Mbps Basic', areaName: 'Gulshan-e-Iqbal',
      amount: 1200, tax: 0, discount: 0, totalAmount: 1200, amountPaid: 1200, balance: 0,
      status: 'paid', issueDate: '2025-05-01', dueDate: '2025-05-07',
      paymentDate: '2025-05-03', paymentMethod: 'Cash',
    };
  }

  back() { this.router.navigate(['/invoices']); }
  edit() { this.router.navigate(['/invoices', this.invoice.id, 'edit']); }
  print() { window.print(); }
}