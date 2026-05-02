// invoice.model.ts mein add karo
export interface Invoice {
  id?: number;
  invoiceNo?: string;
  clientId: number;
  clientName?: string;
  clientCode?: string;
  clientPhone?: string;
  clientAddress?: string;   // ← add
  packageName?: string;     // ← add
  areaName?: string;        // ← add
  amount: number;
  tax?: number;             // ← add
  discount?: number;
  totalAmount: number;
  amountPaid?: number;      // ← add
  balance?: number;         // ← add
  issueDate: string;
  dueDate: string;
  billingMonth?: string;
status: 'unpaid' | 'paid' | 'overdue' | 'cancelled' | 'partial';  paymentDate?: string;     // ← add
  paymentMethod?: string;   // ← add
  createdAt?: string;
}