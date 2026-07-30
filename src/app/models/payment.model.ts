// ── models/payment.model.ts ───────────────────────────────────────────────
// Payment module = Billing Tracker
// Har client ka har month ka record yahan hoga
// Flow: unpaid → invoiced → paid

// ── Main Billing Record ───────────────────────────────────────────────────
export interface ClientBilling {
  id:           number;
  billingNo:    string;        // BIL-2025-0001

  // Client info
  clientId:     number;
  clientName:   string;
    fullName:   string;
  clientCode:   string;        // ISP-0001
  clientPhone?: string;
  areaName?:    string;

  // Package info
  packageId:    number;
  packageName:  string;        // Standard 25MB
  amountDue:    number;        // Rs. 2,500

  // Billing cycle
  periodStart:  string;        // '2025-05-23'
  periodEnd:    string;        // '2025-06-22'
  dueDate:      string;        // same as periodStart of next = periodEnd + 1 day

  // Status — yahi main field hai
  status:       'unpaid' | 'invoiced' | 'paid';

  // Invoice reference — jab Create Invoice click ho tab fill hoga
  invoiceId?:   number;
  invoiceNo?:   string;        // INV-2025-0001

  // Receipt reference — jab Mark Paid ho tab fill hoga
  receiptId?:   number;
  receiptNo?:   string;        // RCP-2025-0001

  createdAt?:   string;
}

// ── Billing Create DTO ────────────────────────────────────────────────────
// Jab client save hoga tab backend yeh record banayega
export interface BillingCreateDto {
  clientId:    number;
  packageId:   number;
  periodStart: string;         // connection_date
  periodEnd:   string;         // connection_date + 1 month - 1 day
  amountDue:   number;         // package ki monthly fee
}

// ── Billing Filter ────────────────────────────────────────────────────────
export interface BillingFilter {
  search?:   string;           // client name ya billing no
  month?:    number;           // 1-12, 0 = all months
  year?:     number;           // 2025, 2026
  status?:   'all' | 'unpaid' | 'invoiced' | 'paid';
  page:      number;
  pageSize:  number;
}

// ── Billing Summary ───────────────────────────────────────────────────────
export interface BillingSummary {
  total:             number;   // total billing records
  unpaidCount:       number;
  invoicedCount:     number;
  paidCount:         number;
  totalAmount:       number;   // sab records ka amount
  collectedAmount:   number;   // sirf paid ka amount
  outstandingAmount: number;   // unpaid + invoiced ka amount
}

// ── OLD Payment model — purane code ke liye rakha hua (hata sakte ho baad mein) ──
// Neeche wali cheezein invoice aur receipt module mein jayengi

// Invoice model (invoice.model.ts mein move karunga)
export interface InvoiceRef {
  id:        number;
  invoiceNo: string;           // INV-2025-0001
  clientId:  number;
  billingId: number;
  amountDue: number;
  status:    'unpaid' | 'overdue' | 'paid';
  dueDate:   string;
  createdAt: string;
}

// Receipt model (receipt.model.ts mein move karunga)
