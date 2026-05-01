import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  suspendedClients: number;
  disconnectedClients: number;
  overdueClients: number;
  newClientsThisMonth: number;
  expiringCount: number;
  monthlyRevenue: number;
  collectedToday: number;
  pendingInvoices: number;
  overdueAmount: number;
  targetRevenue: number;
}

export interface RecentInvoice {
  id: number;
  invoiceNo: string;
  clientName: string;
  amount: number;
  status: string;
  dueDate: string;
}

export interface ActivityLog {
  id: number;
  icon: string;
  iconBg: string;
  title: string;
  highlight: string;
  detail: string;
  time: string;
  amount?: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  collection: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/dashboard/stats`);
  }

  getRecentInvoices(): Observable<RecentInvoice[]> {
    return this.http.get<RecentInvoice[]>(`${environment.apiUrl}/dashboard/recent-invoices`);
  }

  getActivityLog(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${environment.apiUrl}/dashboard/activity`);
  }

  getMonthlyData(): Observable<MonthlyData[]> {
    return this.http.get<MonthlyData[]>(`${environment.apiUrl}/dashboard/monthly`);
  }
}