

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-detail',
  standalone: false,
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.scss',
})
export class ClientDetail implements OnInit {
client: Client | null = null;
  activeTab = 'overview';

  invoices = [
    { id: 1, invoiceNo: 'INV-2025-1248', amount: 1500, status: 'paid', issueDate: '2025-05-01', dueDate: '2025-05-07' },
    { id: 2, invoiceNo: 'INV-2025-1100', amount: 1500, status: 'paid', issueDate: '2025-04-01', dueDate: '2025-04-07' },
    { id: 3, invoiceNo: 'INV-2025-0950', amount: 1500, status: 'paid', issueDate: '2025-03-01', dueDate: '2025-03-07' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Mock load
    this.client = { id: 1, clientCode: 'NP-0001', fullName: 'Ahmed Raza', cnic: '42101-1234567-1', phone: '0300-1234567', email: 'ahmed@email.com', address: 'House 12, Block A, Gulshan-e-Iqbal, Karachi', areaId: 1, areaName: 'Gulshan-e-Iqbal', packageId: 1, packageName: '10 Mbps Basic', status: 'active', connectionDate: '2024-01-15', ipAddress: '192.168.1.101', expiryDate: '2025-06-15', createdAt: '2024-01-10' };
  }

  back() { this.router.navigate(['/clients']); }
edit() {
  if (this.client) {
    this.router.navigate(['/clients', this.client.id, 'edit']);
  }
}
}