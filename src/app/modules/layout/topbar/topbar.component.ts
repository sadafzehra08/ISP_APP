import { Component, Output, EventEmitter, OnInit,ChangeDetectorRef  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService, DueNotification } from '../../../core/services/notification.service';
import { PaymentService } from '../../../core/services/payment.service';
import { filter } from 'rxjs/operators';
import { UserDto } from '../../../core/models/auth.model';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: false
})
export class TopbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  pageTitle = 'Dashboard';
  currentDate: string = '';

  notifCount = 0;
  notifications: DueNotification[] = [];
  showNotifMenu = false;
  creatingInvoiceFor: number | null = null;   // ← billingId jiska invoice ban raha hai

  showUserMenu = false;

  private titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/clients': 'Client Management',
    '/packages': 'Packages',
    '/invoices': 'Invoices',
    '/payments': 'Payments',
    '/reports': 'Reports',
    '/admin': 'Admin Panel',
  };

  constructor(
    private router: Router,
    public auth: AuthService,
    private notifSvc: NotificationService,
    private paymentSvc: PaymentService,  private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.currentDate = new Date().toLocaleDateString('en-PK', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    this.loadNotifications();

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const matched = Object.keys(this.titles).find(k => e.url.startsWith(k));
      this.pageTitle = matched ? this.titles[matched] : 'Dashboard';

      this.showUserMenu = false;
      this.showNotifMenu = false;
    });
  }

  loadNotifications() {
    this.notifSvc.getDueNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.notifCount = data.length;
         this.cdr.detectChanges();   
      },
      error: (e) => console.error('Notifications load error:', e)
    });
  }

  onToggle() { this.toggleSidebar.emit(); }

  get currentUser(): UserDto | null {
    return this.auth.getCurrentUser();
  }

  toggleNotifMenu() {
    this.showNotifMenu = !this.showNotifMenu;
    this.showUserMenu = false;
  }

  closeNotifMenu() {
    this.showNotifMenu = false;
  }

  // ── Seedha dropdown se invoice create karo ─────────────────
  createInvoiceFromNotif(n: DueNotification, e: Event) {
    e.stopPropagation();
    this.creatingInvoiceFor = n.billingId;

    this.paymentSvc.createInvoice(n.billingId).subscribe({
      next: () => {
        // List se hata do, count update karo
        this.notifications = this.notifications.filter(x => x.billingId !== n.billingId);
        this.notifCount = this.notifications.length;
        this.creatingInvoiceFor = null;
      },
      error: (err) => {
        console.error('Create invoice error:', err);
        this.creatingInvoiceFor = null;
      }
    });
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifMenu = false;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  onLogout() {
    this.showUserMenu = false;
    this.auth.logout();
  }
}