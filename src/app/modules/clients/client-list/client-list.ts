// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-client-list',
//   standalone: false,
//   templateUrl: './client-list.html',
//   styleUrl: './client-list.scss',
// })
// export class ClientList {}


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Client, ClientFilter } from '../../../models/client.model';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-list',
  standalone: false,
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})

export class ClientListComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClients: Set<number> = new Set();

  filter: ClientFilter = { page: 1, pageSize: 10, search: '', status: '', areaId: undefined, packageId: undefined };

  totalRecords = 0;
  totalPages = 0;
  loading = false;
  showDeleteModal = false;
  showStatusModal = false;
  clientToDelete: Client | null = null;
  clientToStatus: Client | null = null;
  newStatus = '';

  searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Mock data — replace with API call
  mockClients: Client[] = [
    { id: 1, clientCode: 'NP-0001', fullName: 'Ahmed Raza', cnic: '42101-1234567-1', phone: '0300-1234567', email: 'ahmed@email.com', address: 'House 12, Block A, Gulshan-e-Iqbal', areaId: 1, areaName: 'Gulshan-e-Iqbal', packageId: 1, packageName: '10 Mbps Basic', status: 'active', connectionDate: '2024-01-15', ipAddress: '192.168.1.101', expiryDate: '2025-06-15' },
    { id: 2, clientCode: 'NP-0002', fullName: 'Sara Khan', cnic: '42201-2345678-2', phone: '0311-2345678', email: 'sara@email.com', address: 'Flat 5, Tower B, DHA Phase 2', areaId: 2, areaName: 'DHA Phase 2', packageId: 2, packageName: '25 Mbps Premium', status: 'active', connectionDate: '2024-02-10', ipAddress: '192.168.1.102', expiryDate: '2025-06-10' },
    { id: 3, clientCode: 'NP-0003', fullName: 'Ali Hassan', cnic: '42301-3456789-3', phone: '0321-3456789', email: 'ali@email.com', address: 'Plot 88, PECHS Block 3', areaId: 3, areaName: 'PECHS', packageId: 1, packageName: '10 Mbps Basic', status: 'suspended', connectionDate: '2023-11-05', ipAddress: '192.168.1.103', expiryDate: '2025-05-05' },
    { id: 4, clientCode: 'NP-0004', fullName: 'Zara Malik', cnic: '42401-4567890-4', phone: '0333-4567890', email: 'zara@email.com', address: 'House 45, North Nazimabad', areaId: 4, areaName: 'North Nazimabad', packageId: 3, packageName: '50 Mbps Ultra', status: 'active', connectionDate: '2024-03-22', ipAddress: '192.168.1.104', expiryDate: '2025-06-22' },
    { id: 5, clientCode: 'NP-0005', fullName: 'Usman Tariq', cnic: '42501-5678901-5', phone: '0345-5678901', email: 'usman@email.com', address: 'Flat 12, Clifton Block 4', areaId: 5, areaName: 'Clifton', packageId: 2, packageName: '25 Mbps Premium', status: 'disconnected', connectionDate: '2023-08-14', ipAddress: '192.168.1.105', expiryDate: '2025-04-14' },
    { id: 6, clientCode: 'NP-0006', fullName: 'Fatima Shah', cnic: '42601-6789012-6', phone: '0322-6789012', email: 'fatima@email.com', address: 'House 7, Nazimabad No.3', areaId: 4, areaName: 'North Nazimabad', packageId: 1, packageName: '10 Mbps Basic', status: 'active', connectionDate: '2025-01-10', ipAddress: '192.168.1.106', expiryDate: '2026-01-10' },
    { id: 7, clientCode: 'NP-0007', fullName: 'Bilal Chaudhry', cnic: '42701-7890123-7', phone: '0312-7890123', email: 'bilal@email.com', address: 'Plot 33, Gulshan-e-Hadeed', areaId: 1, areaName: 'Gulshan-e-Iqbal', packageId: 3, packageName: '50 Mbps Ultra', status: 'suspended', connectionDate: '2024-05-01', ipAddress: '192.168.1.107', expiryDate: '2025-06-01' },
    { id: 8, clientCode: 'NP-0008', fullName: 'Hina Baig', cnic: '42801-8901234-8', phone: '0301-8901234', email: 'hina@email.com', address: 'House 99, Malir City', areaId: 6, areaName: 'Malir', packageId: 2, packageName: '25 Mbps Premium', status: 'active', connectionDate: '2024-07-18', ipAddress: '192.168.1.108', expiryDate: '2025-07-18' },
  ];

  areas = [
    { id: 1, name: 'Gulshan-e-Iqbal' }, { id: 2, name: 'DHA Phase 2' },
    { id: 3, name: 'PECHS' }, { id: 4, name: 'North Nazimabad' },
    { id: 5, name: 'Clifton' }, { id: 6, name: 'Malir' },
  ];

  packages = [
    { id: 1, name: '10 Mbps Basic' }, { id: 2, name: '25 Mbps Premium' }, { id: 3, name: '50 Mbps Ultra' },
  ];

  constructor(private router: Router, private clientService: ClientService) {}

  ngOnInit() {
    this.applyFilters();
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => { this.filter.page = 1; this.applyFilters(); });
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  applyFilters() {
    let data = [...this.mockClients];
    if (this.filter.search) {
      const s = this.filter.search.toLowerCase();
      data = data.filter(c =>
        c.fullName.toLowerCase().includes(s) ||
        c.clientCode?.toLowerCase().includes(s) ||
        c.phone.includes(s) ||
        c.cnic.includes(s)
      );
    }
    if (this.filter.status) data = data.filter(c => c.status === this.filter.status);
    if (this.filter.areaId) data = data.filter(c => c.areaId === +this.filter.areaId!);
    if (this.filter.packageId) data = data.filter(c => c.packageId === +this.filter.packageId!);

    this.totalRecords = data.length;
    this.totalPages = Math.ceil(this.totalRecords / this.filter.pageSize);
    const start = (this.filter.page - 1) * this.filter.pageSize;
    this.filteredClients = data.slice(start, start + this.filter.pageSize);
  }

  onSearchChange() { this.searchSubject.next(this.filter.search || ''); }
  onFilterChange() { this.filter.page = 1; this.applyFilters(); }

  clearFilters() {
    this.filter = { page: 1, pageSize: 10, search: '', status: '', areaId: undefined, packageId: undefined };
    this.applyFilters();
  }

  get hasActiveFilters(): boolean {
    return !!(this.filter.search || this.filter.status || this.filter.areaId || this.filter.packageId);
  }

  goToPage(p: number) { if (p >= 1 && p <= this.totalPages) { this.filter.page = p; this.applyFilters(); } }
  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  viewClient(id: number) { this.router.navigate(['/clients', id]); }
  editClient(id: number, e: Event) { e.stopPropagation(); this.router.navigate(['/clients', id, 'edit']); }

  confirmDelete(client: Client, e: Event) { e.stopPropagation(); this.clientToDelete = client; this.showDeleteModal = true; }
  deleteConfirmed() {
    if (this.clientToDelete) {
      this.mockClients = this.mockClients.filter(c => c.id !== this.clientToDelete!.id);
      this.applyFilters();
    }
    this.showDeleteModal = false; this.clientToDelete = null;
  }

  openStatusModal(client: Client, e: Event) { e.stopPropagation(); this.clientToStatus = client; this.newStatus = client.status; this.showStatusModal = true; }
  changeStatus() {
    if (this.clientToStatus) {
      const c = this.mockClients.find(x => x.id === this.clientToStatus!.id);
      if (c) c.status = this.newStatus as any;
      this.applyFilters();
    }
    this.showStatusModal = false; this.clientToStatus = null;
  }

  toggleSelect(id: number) {
    if (this.selectedClients.has(id)) this.selectedClients.delete(id);
    else this.selectedClients.add(id);
  }

  toggleAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) this.filteredClients.forEach(c => this.selectedClients.add(c.id!));
    else this.selectedClients.clear();
  }

  get allSelected(): boolean {
    return this.filteredClients.length > 0 && this.filteredClients.every(c => this.selectedClients.has(c.id!));
  }

  get statusCounts() {
    return {
      total: this.mockClients.length,
      active: this.mockClients.filter(c => c.status === 'active').length,
      suspended: this.mockClients.filter(c => c.status === 'suspended').length,
      disconnected: this.mockClients.filter(c => c.status === 'disconnected').length,
    };
  }

  isExpiringSoon(date: string): boolean {
    const diff = new Date(date).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  }
}