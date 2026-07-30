// ── models/invoice.model.ts ───────────────────────────────────────────────
// Invoice billing record se banta hai (auto) — manually nahi
// Flow: billing unpaid → Create Invoice → Invoice unpaid → Mark Paid → Receipt

export interface Invoice {
  id:          number;
  invoiceNo:   string;         // INV-2025-0001

  // Billing reference — kaunse billing record se bana
  billingId:   number;
  billingNo:   string;         // BIL-2025-0001

  // Client info
  clientId:    number;
  clientName:  string;
    fullName:   string;
  clientCode:  string;
  clientPhone?: string;
  areaName?:   string;

  // Package info
  packageId?:  number;
  packageName?: string;

  // Billing period — payment module se aaya
  periodStart: string;         // '2025-06-18'
  periodEnd:   string;         // '2025-07-17'

  // Amount — sirf ek amount, ISP mein partial nahi
  amount:      number;         // Rs. 2500

  // Dates
  issueDate:   string;         // jab invoice bana
  dueDate:     string;         // kitne din mein pay karna hai

  // Status — sirf 3: unpaid, overdue, paid
  status:      'unpaid' | 'overdue' | 'paid';

  // Paid info — jab Mark Paid ho tab fill hoga
  paidDate?:      string;
  paymentMethod?: 'cash' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cheque' | 'online';
  transactionId?: string;
  notes?:         string;

  // Receipt reference — jab paid ho
  receiptId?:  number;
  receiptNo?:  string;         // RCP-2025-0001

  createdAt?:  string;
}

// ── Invoice Summary ───────────────────────────────────────────────────────
export interface InvoiceSummary {
  total:            number;
  unpaidCount:      number;
  overdueCount:     number;
  paidCount:        number;
  totalOutstanding: number;    // unpaid + overdue amount
  totalCollected:   number;    // paid amount
}

// ── Paged Result ──────────────────────────────────────────────────────────
export interface PagedInvoiceResult {
  data:       Invoice[];
  totalCount: number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

// ── Filter ────────────────────────────────────────────────────────────────
export interface InvoiceFilter {
  search?:   string;           // client name ya invoice no
  status?:   'all' | 'unpaid' | 'overdue' | 'paid';
  fromDate?: string;
  toDate?:   string;
  page:      number;
  pageSize:  number;
}

// ── Create DTO ────────────────────────────────────────────────────────────
// Sirf billingId chahiye — baaki sab billing record se aata hai
export interface InvoiceCreateDto {
  billingId: number;
}

// ── Mark Paid DTO — Invoice module ka "Mark Paid" modal ──────────────────
export interface MarkPaidDto {
  invoiceId:     number;
  paymentMethod: 'cash' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cheque' | 'online';
  transactionId?: string;      // digital payment k liye
  paidDate:      string;       // default: aaj
  notes?:        string;
}
