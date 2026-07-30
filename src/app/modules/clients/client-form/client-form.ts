

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Area, Package, ClientCreateDto, ClientUpdateDto } from '../../../models/client.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-client-form',
  standalone: false,
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss',
})
export class ClientForm implements OnInit {
  form!: FormGroup;
  isEdit    = false;
  clientId: number | null = null;
  loading   = false;
  saving    = false;
  activeTab = 'personal';

  // API se aayenge — NO mock data
  areas:    Area[]    = [];
  packages: Package[] = [];

  constructor(
    private fb:            FormBuilder,
    private route:         ActivatedRoute,
    private router:        Router,
    private clientService: ClientService,
      private cdr:           ChangeDetectorRef 

  ) {}

  // ── LIFECYCLE ──────────────────────────────────────────────
  // ngOnInit() {
  //   this.clientId = this.route.snapshot.params['id']
  //     ? +this.route.snapshot.params['id']
  //     : null;
  //   this.isEdit = !!this.clientId;

  //   this.buildForm();
  //   this.loadDropdowns();

  //   if (this.isEdit) this.loadClient();
  // }
 ngOnInit() {
  this.clientId = this.route.snapshot.params['id']
    ? +this.route.snapshot.params['id']
    : null;
  this.isEdit = !!this.clientId;

  this.buildForm();
  this.loadDropdowns();

  if (this.isEdit) {
    this.loading = true;  // ← explicitly true karo
    this.loadClient();
  }
}

  // ── FORM BUILD ─────────────────────────────────────────────
  buildForm() {
    this.form = this.fb.group({
     clientName:     ['', [Validators.required, Validators.minLength(3)]],  // ← NEW

      fullName:       ['', [Validators.required, Validators.minLength(3)]],
      cnic:           ['', [Validators.required, Validators.pattern(/^\d{5}-\d{7}-\d$/)]],
      phone:          ['', [Validators.required, Validators.pattern(/^03\d{9}$/)]],
      email:          ['', [Validators.email]],
      address:        ['', [Validators.required]],
      areaId:         ['', [Validators.required]],
      packageId:      ['', [Validators.required]],
      connectionDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      expiryDate:     [''],
      ipAddress:      ['', [Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)]],
      status:         ['active', [Validators.required]],
    });
  }

  // ── DROPDOWNS ──────────────────────────────────────────────
  loadDropdowns() {
    this.clientService.getAreas().subscribe({
      next:  (a) => this.areas    = a,
      error: ()  => console.error('Areas load failed')
    });

    this.clientService.getPackages().subscribe({
      next:  (p) => this.packages = p,
      error: ()  => console.error('Packages load failed')
    });
  }

  // ── LOAD CLIENT (edit mode) ────────────────────────────────
  // loadClient() {
  //   this.loading = true;
  //   this.clientService.getById(this.clientId!).subscribe({
  //     next: (client) => {
  //       this.form.patchValue({
  //         fullName:       client.fullName,
  //         cnic:           client.cnic,
  //         phone:          client.phone,
  //         email:          client.email        || '',
  //         address:        client.address,
  //         areaId:         client.area?.id     || '',
  //         packageId:      client.package?.id  || '',
  //         connectionDate: client.connectionDate?.toString().split('T')[0],
  //         expiryDate:     client.expiryDate?.toString().split('T')[0] || '',
  //         ipAddress:      client.ipAddress    || '',
  //         status:         client.status,
  //       });
  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.loading = false;
  //       this.router.navigate(['/clients']);
  //     }
  //   });
  // }
loadClient() {
  this.clientService.getById(this.clientId!).subscribe({
    next: (client) => {
      this.form.patchValue({
        clientName:     client.clientName,     // ← NEW

        fullName:       client.fullName,
        cnic:           client.cnic,
        phone:          client.phone,
        email:          client.email        || '',
        address:        client.address,
        areaId:         client.area?.id     || '',
        packageId:      client.package?.id  || '',
        connectionDate: client.connectionDate?.toString().split('T')[0],
        expiryDate:     client.expiryDate?.toString().split('T')[0] || '',
        ipAddress:      client.ipAddress    || '',
        status:         client.status,
      });
      this.loading = false;  // ← success pe false
            this.cdr.detectChanges();  // ← force UI update

    },
    error: (err) => {
      console.error('Load error:', err);
      this.loading = false;  // ← error pe bhi false — warna stuck
      // this.router.navigate(['/clients']);  // ← abhi comment out rakho
            this.cdr.detectChanges();  // ← force UI update

    }
  });
}
  // ── GETTERS ────────────────────────────────────────────────
  get f() { return this.form.controls; }

  get selectedPackage(): Package | undefined {
    return this.packages.find(p => p.id === +this.form.value.packageId);
  }

  get selectedArea(): Area | undefined {
    return this.areas.find(a => a.id === +this.form.value.areaId);
  }

  // ── CNIC AUTO FORMAT ───────────────────────────────────────
  formatCnic(e: Event) {
    let v = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    if (v.length > 5)  v = v.slice(0, 5)  + '-' + v.slice(5);
    if (v.length > 13) v = v.slice(0, 13) + '-' + v.slice(13);
    this.form.get('cnic')?.setValue(v.slice(0, 15), { emitEvent: false });
  }

  // ── SAVE ───────────────────────────────────────────────────
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const val = this.form.value;

    if (this.isEdit) {
      const dto: ClientUpdateDto = {
        id:             this.clientId!,
        clientName:     val.clientName,   // ← NEW

        fullName:       val.fullName,
        cnic:           val.cnic,
        phone:          val.phone,
        email:          val.email      || undefined,
        address:        val.address,
        areaId:         +val.areaId,
        packageId:      +val.packageId,
        connectionDate: val.connectionDate,
        expiryDate:     val.expiryDate || undefined,
        ipAddress:      val.ipAddress  || undefined,
        status:         val.status,
      };

      this.clientService.update(this.clientId!, dto).subscribe({
        next: () => {
          debugger;
          console.log('Update successful, navigating to client detail...');
          this.saving = false;
           this.router.navigate(['/clients', this.clientId]);
                //    this.router.navigate(['/clients']);

        },
        error: () => { this.saving = false;

         }
      });

    } else {
      const dto: ClientCreateDto = {
        clientName:     val.clientName,   // ← NEW
        fullName:       val.fullName,
        cnic:           val.cnic,
        phone:          val.phone,
        email:          val.email      || undefined,
        address:        val.address,
        areaId:         +val.areaId,
        packageId:      +val.packageId,
        connectionDate: val.connectionDate,
        expiryDate:     val.expiryDate || undefined,
        ipAddress:      val.ipAddress  || undefined,
        status:         val.status,
      };
      this.clientService.create(dto).subscribe({
        next: (created) => {
          this.saving = false;
          this.router.navigate(['/clients', created.id]);
        },
        error: () => { this.saving = false; }
      });
    }
  }

  // ── CANCEL ─────────────────────────────────────────────────
  cancel() { this.router.navigate(['/clients']); }
}