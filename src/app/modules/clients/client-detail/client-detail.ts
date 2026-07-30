
import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../models/client.model';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-detail',
  standalone: false,
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.scss',
})
export class ClientDetail implements OnInit {
  client: Client | null = null;
  loading = false;
  activeTab = 'overview';

  // Abhi mock — baad mein invoices API se aayenge
  invoices = [
    { id: 1, invoiceNo: 'INV-2025-1248', amount: 1500, status: 'paid', issueDate: '2025-05-01', dueDate: '2025-05-07' },
    { id: 2, invoiceNo: 'INV-2025-1100', amount: 1500, status: 'paid', issueDate: '2025-04-01', dueDate: '2025-04-07' },
    { id: 3, invoiceNo: 'INV-2025-0950', amount: 1500, status: 'paid', issueDate: '2025-03-01', dueDate: '2025-03-07' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService , 
       private cdr:ChangeDetectorRef  
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) this.loadClient(+id);
  }

  loadClient(id: number) {
    this.loading = true;
    this.clientService.getById(id).subscribe({
      next: (data) => {
        this.client  = data;
        this.loading = false;
                this.cdr.detectChanges();  // ← add karo

      },
      error: () => {
        this.loading = false;
                this.cdr.detectChanges();  // ← add karo

        this.router.navigate(['/clients']); // client nahi mila to list pe wapas
      }
    });
  }

  back() { this.router.navigate(['/clients']); }

  edit() {
    if (this.client) {
      this.router.navigate(['/clients', this.client.id, 'edit']);
    }
  }
}