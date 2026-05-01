export interface Payment {
  id?: number;
  invoiceId: number;
  invoiceNo?: string;
  clientId: number;
  clientName?: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank' | 'easypaisa' | 'jazzcash' | 'online';
  referenceNo?: string;
  notes?: string;
  receivedBy?: string;
}