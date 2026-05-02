export interface Payment {
  id?: number;
  paymentNo?: string;
  clientId: number;
  clientName?: string;
  clientCode?: string;
  clientPhone?: string;
  invoiceId?: number;
  invoiceNo?: string;
  amount: number;
  method: 'cash' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cheque' | 'online';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentDate: string;
  receivedBy?: string;
  transactionId?: string;
  notes?: string;
  packageName?: string;
  areaName?: string;
  createdAt?: string;
}