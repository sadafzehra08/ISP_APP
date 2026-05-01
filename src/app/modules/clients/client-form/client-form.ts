// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-client-form',
//   standalone: false,
//   templateUrl: './client-form.html',
//   styleUrl: './client-form.scss',
// })
// export class ClientForm {}


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-client-form',
  standalone: false,
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss',
})
export class ClientForm implements OnInit {
  form!: FormGroup;
  isEdit = false;
  clientId: number | null = null;
  loading = false;
  saving = false;
  activeTab = 'personal';

  areas = [
    { id: 1, name: 'Gulshan-e-Iqbal' }, { id: 2, name: 'DHA Phase 2' },
    { id: 3, name: 'PECHS' }, { id: 4, name: 'North Nazimabad' },
    { id: 5, name: 'Clifton' }, { id: 6, name: 'Malir' },
  ];

  packages = [
    { id: 1, name: '10 Mbps Basic', price: 1200 },
    { id: 2, name: '25 Mbps Premium', price: 2200 },
    { id: 3, name: '50 Mbps Ultra', price: 3500 },
  ];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.clientId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.clientId;
    this.buildForm();
    if (this.isEdit) this.loadClient();
  }

  buildForm() {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      cnic: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{7}-\d$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^03\d{9}$/)]],
      email: ['', [Validators.email]],
      address: ['', [Validators.required]],
      areaId: ['', [Validators.required]],
      packageId: ['', [Validators.required]],
      connectionDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      ipAddress: ['', [Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)]],
      status: ['active', [Validators.required]],
      notes: [''],
    });
  }

  loadClient() {
    // Mock load — replace with API
    const mockData = { fullName: 'Ahmed Raza', cnic: '42101-1234567-1', phone: '03001234567', email: 'ahmed@email.com', address: 'House 12, Block A, Gulshan-e-Iqbal', areaId: 1, packageId: 1, connectionDate: '2024-01-15', ipAddress: '192.168.1.101', status: 'active', notes: '' };
    this.form.patchValue(mockData);
  }

  get f() { return this.form.controls; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.router.navigate(['/clients']);
    }, 800);
  }

  cancel() { this.router.navigate(['/clients']); }

  formatCnic(e: Event) {
    let v = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
    if (v.length > 13) v = v.slice(0, 13) + '-' + v.slice(13);
    this.form.get('cnic')?.setValue(v.slice(0, 15), { emitEvent: false });
  }

  get selectedPackage() {
    return this.packages.find(p => p.id === +this.form.value.packageId);
  }
}