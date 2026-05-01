import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],standalone: false
})
export class TopbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  pageTitle = 'Dashboard';
  currentDate: string = '';
  notifCount = 5;

  private titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/clients': 'Client Management',
    '/packages': 'Packages',
    '/invoices': 'Invoices',
    '/payments': 'Payments',
    '/reports': 'Reports',
    '/admin': 'Admin Panel',
  };

  constructor(private router: Router, public auth: AuthService) {}

  ngOnInit() {
    this.currentDate = new Date().toLocaleDateString('en-PK', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const matched = Object.keys(this.titles).find(k => e.url.startsWith(k));
      this.pageTitle = matched ? this.titles[matched] : 'Dashboard';
    });
  }

  onToggle() { this.toggleSidebar.emit(); }
}