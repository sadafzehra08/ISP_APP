import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStats, RecentInvoice, MonthlyData } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { UserDto } from '../../core/models/auth.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {

  // Default zero state — API se fill hoga
  stats: DashboardStats = {
    totalClients: 0, activeClients: 0, suspendedClients: 0,
    disconnectedClients: 0, overdueClients: 0, newClientsThisMonth: 0,
    expiringCount: 0, monthlyRevenue: 0, collectedToday: 0,
    pendingInvoices: 0, overdueAmount: 0, targetRevenue: 0
  };

  recentInvoices: RecentInvoice[] = [];

  // Abhi backend nahi bana — empty rakho, chart sirf fallback dikhayega
  monthlyData: MonthlyData[] = [];

  selectedTab = 'Monthly';
  maxRevenue = 1; // 0 se divide na ho isliye 1 default
  currentDate = new Date();
  greeting = '';
  loading = false;

  constructor(public auth: AuthService, private dashService: DashboardService,  private cdr: ChangeDetectorRef   // ← add karo
) {}

ngOnInit() {
  this.setGreeting();
  this.dashService.getStats().subscribe(s => {
    this.stats = s;
    this.cdr.detectChanges();   // ← force update
  });
  this.dashService.getRecentInvoices().subscribe(d => {
    this.recentInvoices = d;
    this.cdr.detectChanges();
  });
    this.loadMonthlyData();   // ← yeh line add karo

}
loadMonthlyData() {
  this.dashService.getMonthlyData().subscribe({
    next: (data) => {
      this.monthlyData = data;
      this.maxRevenue = Math.max(...data.map(d => d.revenue), 1);
      this.cdr.detectChanges();   // ← add karo
    },
    error: (e) => console.error('Monthly data load error:', e)
  });
}
  loadStats() {
    this.loading = true;
    this.dashService.getStats().subscribe({
      next: (s) => {
        this.stats = s;
        this.loading = false;
      },
      error: (e) => {
        console.error('Dashboard stats load error:', e);
        this.loading = false;
      }
    });
  }

  loadRecentInvoices() {
    this.dashService.getRecentInvoices().subscribe({
      next: (data) => this.recentInvoices = data,
      error: (e) => console.error('Recent invoices load error:', e)
    });
  }

  // loadMonthlyData() {
  //   this.dashService.getMonthlyData().subscribe({
  //     next: (data) => {
  //       this.monthlyData = data;
  //       this.maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  //     },
  //     error: (e) => console.error('Monthly data load error:', e)
  //   });
  // }

  setGreeting() {
    const h = new Date().getHours();
    this.greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  }

  getBarHeight(val: number): string {
    return ((val / this.maxRevenue) * 100) + '%';
  }

  get activePercent(): number {
    if (!this.stats.totalClients) return 0;
    return Math.round((this.stats.activeClients / this.stats.totalClients) * 100);
  }

  get suspendedPercent(): number {
    if (!this.stats.totalClients) return 0;
    return Math.round((this.stats.suspendedClients / this.stats.totalClients) * 100);
  }

  get targetPercent(): number {
    if (!this.stats.targetRevenue) return 0;
    return Math.round((this.stats.monthlyRevenue / this.stats.targetRevenue) * 100);
  }

  formatCurrency(val: number): string {
    if (val >= 100000) return '₨' + (val / 100000).toFixed(1) + 'L';
    if (val >= 1000) return '₨' + (val / 1000).toFixed(0) + 'K';
    return '₨' + val;
  }

  get currentUser(): UserDto | null {
    return this.auth.getCurrentUser();
  }
}