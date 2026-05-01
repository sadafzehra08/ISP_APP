export interface Invoice {
  id?: number;
  invoiceNo?: string;
  clientId: number;
  clientName?: string;
  clientCode?: string;
  clientPhone?: string;
  clientAddress?: string;
  packageName?: string;
  areaName?: string;
  amount: number;
  tax?: number;
  discount?: number;
  totalAmount?: number;
  amountPaid?: number;
  balance?: number;
  status: 'unpaid' | 'paid' | 'partial' | 'overdue';
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt?: string;
}