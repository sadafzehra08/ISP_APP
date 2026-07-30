import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserDto } from '../../../core/models/auth.model';

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  badge?: string | number;
  badgeColor?: 'red' | 'green' | 'amber';
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false
})
export class SidebarComponent {
  @Input() collapsed = false;

  mainNav: NavItem[] = [
    { label: 'Dashboard', icon: '⚡', route: '/dashboard' },
    { label: 'Packages', icon: '📦', route: '/packages' },
    { label: 'Clients', icon: '👥', route: '/clients', badge: 1248, badgeColor: 'green' },

   // { label: 'Connections', icon: '📡', route: '/connections' },
  ];

  billingNav: NavItem[] = [
  
    { label: 'Payments', icon: '💳', route: '/payments' },
    { label: 'Invoices', icon: '🧾', route: '/invoices', badge: 47, badgeColor: 'red' },
    { label: 'Receipts', icon: '📊', route: '/receipts' },

   // { label: 'Overdue', icon: '⚠️', route: '/invoices/overdue', badge: 23, badgeColor: 'red' },
  ];

 // analyticsNav: NavItem[] = [
    //  { label: 'Users', icon: '👤', route: '/users' },  

   // { label: 'Analytics', icon: '📈', route: '/analytics' },
  //];

  systemNav: NavItem[] = [
    { label: 'Users', icon: '👤', route: '/users' },  
    { label: 'Admin Panel', icon: '🏢', route: '/admin' },
    { label: 'Settings', icon: '⚙️', route: '/admin/settings' },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout() { this.auth.logout(); }

  get userInitials(): string {
    const name = this.auth.getCurrentUser()?.fullName || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
    get currentUser(): UserDto | null {
      return this.auth.getCurrentUser();
    }
}