import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Client, ClientFilter, Area, Package } from '../../../models/client.model';
import { ClientService } from '../../../core/services/client.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-client-list',
  standalone: false,
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientListComponent implements OnInit, OnDestroy {

  filteredClients: Client[] = [];
  selectedClients: Set<number> = new Set();

  filter: ClientFilter = {
    page: 1, pageSize: 10,
    search: '', status: '',
    areaId: undefined, packageId: undefined
  };

  totalRecords = 0;
  totalPages   = 0;
  loading      = false;

  showDeleteModal = false;
  showStatusModal = false;
  clientToDelete: Client | null = null;
  clientToStatus: Client | null = null;
  newStatus = '';

  // Status counts — API se aayenge
  statusCounts = { total: 0, active: 0, suspended: 0, disconnected: 0 };

  // Dropdowns
  areas:    Area[]    = [];
  packages: Package[] = [];

  searchSubject  = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private clientService: ClientService,  private cdr: ChangeDetectorRef  
  ) {}

ngOnInit() {
  // Pehle clients load karo, dropdowns baad mein
  this.loadClients();
  this.loadDropdowns(); // yeh block nahi karta

  this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    takeUntil(this.destroy$)
  ).subscribe(() => {
    this.filter.page = 1;
    this.loadClients();
  });
}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── DATA LOAD ──────────────────────────────────────────────
loadClients() {
  console.log('Loading clients with filter:', this.filter);
  this.loading = true;
  this.clientService.getAll(this.filter).subscribe({
    next: (res) => {
        console.log('RAW RESPONSE:', JSON.stringify(res));  // ← yeh add kar

      this.filteredClients = res.data ?? [];  // null safety
      this.totalRecords    = res.totalCount;
      this.totalPages      = res.totalPages;
      this.updateStatusCounts(this.filteredClients);
      this.loading = false;
            this.cdr.detectChanges(); // <-- YEH LINE ADD KARO
    },
    error: (err) => {
      console.error('Load failed:', err);
      this.loading = false;
            this.cdr.detectChanges(); // <-- YEH LINE ADD KARO
    }
  });
}

loadDropdowns() {
  this.clientService.getAreas().subscribe(a => {
    this.areas = a;
    console.log("areas", this.areas); 
  });

  this.clientService.getPackages().subscribe(p => {
    this.packages = p;
    console.log("packages", this.packages);
  });
}

  // Status counts current page se calculate karo
  // (full count k liye backend mein alag endpoint chahiye hoga baad mein)
  updateStatusCounts(clients: Client[]) {
    this.statusCounts = {
      total:        this.totalRecords,
      active:       clients.filter(c => c.status === 'active').length,
      suspended:    clients.filter(c => c.status === 'suspended').length,
      disconnected: clients.filter(c => c.status === 'disconnected').length,
    };
  }

  // ── FILTERS ────────────────────────────────────────────────
  onSearchChange() { this.searchSubject.next(this.filter.search || ''); }

  onFilterChange() {
    this.filter.page = 1;
    this.loadClients();
  }

  clearFilters() {
    this.filter = {
      page: 1, pageSize: 10,
      search: '', status: '',
      areaId: undefined, packageId: undefined
    };
    this.loadClients();
  }

  get hasActiveFilters(): boolean {
    return !!(this.filter.search || this.filter.status ||
              this.filter.areaId || this.filter.packageId);
  }

  // ── PAGINATION ─────────────────────────────────────────────
  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) {
      this.filter.page = p;
      this.loadClients();
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // ── NAVIGATION ─────────────────────────────────────────────
  viewClient(id: number) {
    this.router.navigate(['/clients', id]);
  }

  // editClient(id: number, e: Event) {
  //   console.log("event",e)
  //   e.stopPropagation();
  //   this.router.navigate(['/clients', id, 'edit']);
  // }
  editClient(id: number, e: Event) {
  e.stopPropagation();
  console.log('Navigating to:', ['/clients', id, 'edit']);
  this.router.navigate(['/clients', id, 'edit']).then(result => {
    console.log('Navigation result:', result);
  });
}

  // ── DELETE ─────────────────────────────────────────────────
  confirmDelete(client: Client, e: Event) {
    e.stopPropagation();
    this.clientToDelete  = client;
    this.showDeleteModal = true;
  }

  deleteConfirmed() {
    if (this.clientToDelete?.id) {
      this.clientService.delete(this.clientToDelete.id).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.clientToDelete  = null;
          this.loadClients();   // list refresh
        },
        error: () => {
          this.showDeleteModal = false;
        }
      });
    }
  }

  // ── STATUS CHANGE ──────────────────────────────────────────
  openStatusModal(client: Client, e: Event) {
    e.stopPropagation();
    this.clientToStatus  = client;
    this.newStatus       = client.status;
    this.showStatusModal = true;
  }

  changeStatus() {
    if (this.clientToStatus?.id) {
      this.clientService.updateStatus(
        this.clientToStatus.id, this.newStatus
      ).subscribe({
        next: () => {
          this.showStatusModal = false;
          this.clientToStatus  = null;
          this.loadClients();   // list refresh
        },
        error: () => {
          this.showStatusModal = false;
        }
      });
    }
  }

  // ── SELECTION ──────────────────────────────────────────────
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
    return this.filteredClients.length > 0 &&
           this.filteredClients.every(c => this.selectedClients.has(c.id!));
  }

  // ── HELPERS ────────────────────────────────────────────────
  isExpiringSoon(date: string): boolean {
    if (!date) return false;
    const diff = new Date(date).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  }
}