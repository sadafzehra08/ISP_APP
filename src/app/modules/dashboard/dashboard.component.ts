import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStats, RecentInvoice, ActivityLog, MonthlyData } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalClients: 1248, activeClients: 1105, suspendedClients: 137,
    disconnectedClients: 84, overdueClients: 23, newClientsThisMonth: 38,
    expiringCount: 142, monthlyRevenue: 480000, collectedToday: 310000,
    pendingInvoices: 47, overdueAmount: 68500, targetRevenue: 550000
  };

  recentInvoices: RecentInvoice[] = [
    { id: 1, invoiceNo: 'INV-2025-1248', clientName: 'Ahmed Raza', amount: 1500, status: 'paid', dueDate: '2025-05-01' },
    { id: 2, invoiceNo: 'INV-2025-1247', clientName: 'Sara Khan', amount: 2200, status: 'unpaid', dueDate: '2025-05-05' },
    { id: 3, invoiceNo: 'INV-2025-1246', clientName: 'Ali Hassan', amount: 1800, status: 'overdue', dueDate: '2025-04-28' },
    { id: 4, invoiceNo: 'INV-2025-1245', clientName: 'Zara Malik', amount: 3500, status: 'paid', dueDate: '2025-05-02' },
    { id: 5, invoiceNo: 'INV-2025-1244', clientName: 'Usman Tariq', amount: 1200, status: 'unpaid', dueDate: '2025-05-10' },
  ];

//   activityLogs: ActivityLog[] = [
//     { id: 1, icon: '💵', iconBg: 'rgba(0,229,160,0.1)', title: 'paid invoice', highlight: 'Ahmed Raza', detail: '2 mins ago · Cash', amount: 1500 },
//     { id: 2, icon: '👤', iconBg: 'rgba(0,180,255,0.1)', title: 'New client added', highlight: 'Fatima Shah', detail: '15 mins ago · 10 Mbps Package' },
//     { id: 3, icon: '⚠️', iconBg: 'rgba(255,179,64,0.1)', title: 'account suspended', highlight: 'Bilal Chaudhry', detail: '1 hour ago · Non-payment' },
//     { id: 4, icon: '💵', iconBg: 'rgba(0,229,160,0.1)', title: 'paid via JazzCash', highlight: 'Zara Malik', detail: '2 hours ago · Online', amount: 3500 },
//   ];

  monthlyData: MonthlyData[] = [
    { month: 'Jan', revenue: 320000, collection: 285000 },
    { month: 'Feb', revenue: 360000, collection: 320000 },
    { month: 'Mar', revenue: 400000, collection: 360000 },
    { month: 'Apr', revenue: 340000, collection: 300000 },
    { month: 'May', revenue: 480000, collection: 430000 },
    { month: 'Jun', revenue: 380000, collection: 340000 },
    { month: 'Jul', revenue: 430000, collection: 390000 },
    { month: 'Aug', revenue: 460000, collection: 420000 },
    { month: 'Sep', revenue: 390000, collection: 350000 },
    { month: 'Oct', revenue: 500000, collection: 460000 },
    { month: 'Nov', revenue: 450000, collection: 410000 },
    { month: 'Dec', revenue: 520000, collection: 475000 },
  ];

  selectedTab = 'Monthly';
  maxRevenue = 0;
  currentDate = new Date();
  greeting = '';

  constructor(public auth: AuthService, private dashService: DashboardService) {}

  ngOnInit() {
    this.maxRevenue = Math.max(...this.monthlyData.map(d => d.revenue));
    this.setGreeting();
    // Uncomment when API ready:
    // this.dashService.getStats().subscribe(s => this.stats = s);
  }

  setGreeting() {
    const h = new Date().getHours();
    this.greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  }

  getBarHeight(val: number): string {
    return ((val / this.maxRevenue) * 100) + '%';
  }

  get activePercent(): number {
    return Math.round((this.stats.activeClients / this.stats.totalClients) * 100);
  }

  get suspendedPercent(): number {
    return Math.round((this.stats.suspendedClients / this.stats.totalClients) * 100);
  }

  get targetPercent(): number {
    return Math.round((this.stats.monthlyRevenue / this.stats.targetRevenue) * 100);
  }

  formatCurrency(val: number): string {
    if (val >= 100000) return '₨' + (val / 100000).toFixed(1) + 'L';
    if (val >= 1000) return '₨' + (val / 1000).toFixed(0) + 'K';
    return '₨' + val;
  }
}