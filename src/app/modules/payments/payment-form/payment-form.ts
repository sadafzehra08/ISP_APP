
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-form',
  standalone: false,
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.scss',
})
export class PaymentForm implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;

  clients = [
    { id: 1, name: 'Ahmed Raza', code: 'NP-0001', balance: 0 },
    { id: 2, name: 'Sara Khan', code: 'NP-0002', balance: 2000 },
    { id: 3, name: 'Ali Hassan', code: 'NP-0003', balance: 600 },
    { id: 4, name: 'Zara Malik', code: 'NP-0004', balance: 3500 },
    { id: 5, name: 'Usman Tariq', code: 'NP-0005', balance: 0 },
    { id: 6, name: 'Fatima Shah', code: 'NP-0006', balance: 1200 },
  ];

  unpaidInvoices = [
    { id: 2, invoiceNo: 'INV-2025-0002', clientId: 2, amount: 2000, balance: 2000 },
    { id: 3, invoiceNo: 'INV-2025-0003', clientId: 3, amount: 1200, balance: 600 },
    { id: 4, invoiceNo: 'INV-2025-0004', clientId: 4, amount: 3500, balance: 3500 },
    { id: 6, invoiceNo: 'INV-2025-0006', clientId: 6, amount: 1200, balance: 1200 },
  ];

  filteredInvoices: any[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.isEdit = !!this.route.snapshot.params['id'];
    this.buildForm();
    if (this.isEdit) this.loadPayment();
  }

  buildForm() {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      invoiceId: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      method: ['cash', Validators.required],
      paymentDate: [new Date().toISOString().split('T')[0], Validators.required],
      transactionId: [''],
      receivedBy: ['Admin'],
      notes: [''],
    });
    this.form.get('clientId')?.valueChanges.subscribe(id => {
      this.filteredInvoices = this.unpaidInvoices.filter(i => i.clientId === +id);
      this.form.get('invoiceId')?.reset();
      this.form.get('amount')?.reset(0);
    });
    this.form.get('invoiceId')?.valueChanges.subscribe(id => {
      const inv = this.unpaidInvoices.find(i => i.id === +id);
      if (inv) this.form.get('amount')?.setValue(inv.balance);
    });
  }

  loadPayment() {
    this.filteredInvoices = this.unpaidInvoices;
    this.form.patchValue({ clientId: 2, invoiceId: 2, amount: 2000, method: 'jazzcash', paymentDate: '2025-05-04', transactionId: 'JZ-9981234', receivedBy: 'Admin' });
  }

  get f() { return this.form.controls; }
  get selectedClient() { return this.clients.find(c => c.id === +this.form.value.clientId); }
  get selectedInvoice() { return this.filteredInvoices.find(i => i.id === +this.form.value.invoiceId); }
  get showTxnField() { return ['jazzcash', 'easypaisa', 'bank_transfer', 'cheque', 'online'].includes(this.form.value.method); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    setTimeout(() => { this.saving = false; this.router.navigate(['/payments']); }, 800);
  }
  cancel() { this.router.navigate(['/payments']); }
}