export interface Invoice {
  id?: number;
  invoiceNo?: string;
  clientId: number;
  clientName?: string;
  packageId: number;
  packageName?: string;
  amount: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  billingMonth: string;
  status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  createdAt?: string;
}