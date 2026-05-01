
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoive-form',
  standalone: false,
  templateUrl: './invoive-form.html',
  styleUrl: './invoive-form.scss',
})
export class InvoiveForm implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;

  clients = [
    { id: 1, name: 'Ahmed Raza', code: 'NP-0001', packageName: '10 Mbps Basic', packagePrice: 1200 },
    { id: 2, name: 'Sara Khan', code: 'NP-0002', packageName: '25 Mbps Premium', packagePrice: 2200 },
    { id: 3, name: 'Ali Hassan', code: 'NP-0003', packageName: '10 Mbps Basic', packagePrice: 1200 },
    { id: 4, name: 'Zara Malik', code: 'NP-0004', packageName: '50 Mbps Ultra', packagePrice: 3500 },
    { id: 5, name: 'Usman Tariq', code: 'NP-0005', packageName: '25 Mbps Premium', packagePrice: 2200 },
  ];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.isEdit = !!this.route.snapshot.params['id'];
    this.buildForm();
    if (this.isEdit) this.loadInvoice();
  }

  buildForm() {
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      discount: [0],
      tax: [0],
      issueDate: [today, Validators.required],
      dueDate: [due, Validators.required],
      notes: [''],
    });
  }

  loadInvoice() {
    this.form.patchValue({ clientId: 1, amount: 1200, discount: 0, tax: 0, issueDate: '2025-05-01', dueDate: '2025-05-07' });
  }

  get selectedClient() { return this.clients.find(c => c.id === +this.form.value.clientId); }

  onClientChange() {
    const c = this.selectedClient;
    if (c) this.form.patchValue({ amount: c.packagePrice });
  }

  get totalAmount() {
    const { amount, discount, tax } = this.form.value;
    return (amount || 0) - (discount || 0) + (tax || 0);
  }

  get f() { return this.form.controls; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    setTimeout(() => { this.saving = false; this.router.navigate(['/invoices']); }, 800);
  }

  cancel() { this.router.navigate(['/invoices']); }
}