import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DueNotification {
  billingId: number;
  billingNo: string;
  clientName: string;
  clientCode: string;
  packageName: string | null;
  amountDue: number;
  dueDate: string;
  periodStart: string;
  periodEnd: string;
  daysOverdue: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getDueNotifications(): Observable<DueNotification[]> {
    return this.http.get<DueNotification[]>(`${environment.apiUrl}/notification/due`);
  }
}