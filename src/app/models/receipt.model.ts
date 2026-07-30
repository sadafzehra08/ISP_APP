// ── models/receipt.model.ts ───────────────────────────────────────────────

export interface Receipt {
  id:            number;
  receiptNo:     string;        // RCP-2026-0001
  invoiceId:     number;
  invoiceNo:     string;
  clientId:      number;
  clientName:    string;
  fullName:    string;
  clientCode:    string;
  clientPhone?:  string;
  areaName?:     string;
  packageName?:  string;
  periodStart:   string;
  periodEnd:     string;
  amountPaid:    number;
  paymentMethod: 'cash' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cheque' | 'online';
  transactionId?: string;
  paidDate:      string;
  notes?:        string;
  createdAt:     string;
}

export interface ReceiptSummary {
  total:           number;
  totalCollected:  number;
  cashAmount:      number;
  digitalAmount:   number;
}

export interface ReceiptFilter {
  search?:   string;
  method?:   string;
  fromDate?: string;
  toDate?:   string;
  page:      number;
  pageSize:  number;
}

export interface PagedReceiptResult {
  data:       Receipt[];
  totalCount: number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}