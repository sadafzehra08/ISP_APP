// ── package-form.ts ── Real API ───────────────────────────────────────────
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Package } from '../../../models/package.model';
import { PackageService } from '../../../core/services/package.service';

@Component({
  selector:    'app-package-form',
  standalone:  false,
  templateUrl: './package-form.html',
  styleUrl:    './package-form.scss',
})
export class PackageForm implements OnInit {
  form!:      FormGroup;
  isEdit      = false;
  packageId:  number | null = null;
  saving      = false;
  loading     = false;
  newFeature  = '';

  tierOptions = [
    { value: 'basic',    label: 'Basic',    icon: '🌐' },
    { value: 'advanced', label: 'Advanced', icon: '⚡' },
    { value: 'silver',   label: 'Silver',   icon: '🥈' },
    { value: 'premium',  label: 'Premium',  icon: '👑' },
  ];

  constructor(
    private fb:             FormBuilder,
    private route:          ActivatedRoute,
    private router:         Router,
    private packageService: PackageService,
    private cdr:            ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.packageId = this.route.snapshot.params['id']
      ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.packageId;

    this.buildForm();
    if (this.isEdit) this.loadPackage();
  }

  buildForm() {
    this.form = this.fb.group({
      name:              ['', [Validators.required, Validators.minLength(2)]],
      tier:              ['basic', Validators.required],
      speedMbps:         [10,  [Validators.required, Validators.min(1)]],
      uploadSpeedMbps:   [5,   [Validators.required, Validators.min(1)]],
      burstSpeed:        [15,  [Validators.min(0)]],
      priceMonthly:      [1200, [Validators.required, Validators.min(1)]],
      priceQuarterly:    [3300, [Validators.min(0)]],
      priceYearly:       [12000,[Validators.min(0)]],
      dataLimitGb:       [null],
      validityDays:      [30,  [Validators.required, Validators.min(1)]],
      maxDevices:        [2,   [Validators.required, Validators.min(1)]],
      description:       [''],
      isActive:          [true],
      features:          this.fb.array([]),
    });
  }

  loadPackage() {
    this.loading = true;
    this.packageService.getById(this.packageId!).subscribe({
      next: (pkg: Package) => {
        this.form.patchValue({
          name:            pkg.name,
          tier:            pkg.tier,
          speedMbps:       pkg.speedMbps,
          uploadSpeedMbps: pkg.uploadSpeedMbps,
          burstSpeed:      pkg.burstSpeed,
          priceMonthly:    pkg.priceMonthly,
          priceQuarterly:  pkg.priceQuarterly,
          priceYearly:     pkg.priceYearly,
          dataLimitGb:     pkg.dataLimitGb ?? null,
          validityDays:    pkg.validityDays,
          maxDevices:      pkg.maxDevices,
          description:     pkg.description,
          isActive:        pkg.isActive,
        });

        // Features array fill karo
        this.featuresArray.clear();
        (pkg.features || []).forEach(f => this.featuresArray.push(this.fb.control(f)));

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/packages']);
      }
    });
  }

  get f() { return this.form.controls; }
  get featuresArray(): FormArray { return this.form.get('features') as FormArray; }

  addFeature() {
    const feat = this.newFeature.trim();
    if (feat) { this.featuresArray.push(this.fb.control(feat)); this.newFeature = ''; }
  }
  removeFeature(i: number) { this.featuresArray.removeAt(i); }

  getTierIcon(tier: string): string {
    const icons: any = { basic: '🌐', advanced: '⚡', silver: '🥈', premium: '👑' };
    return icons[tier] || '🌐';
  }

  get previewColor(): string {
    const colors: any = { basic: 'var(--primary)', advanced: 'var(--green)', silver: '#c0c0c0', premium: '#ffd700' };
    return colors[this.form.value.tier] || 'var(--primary)';
  }

  get savingPercent(): number {
    if (!this.form.value.priceMonthly || !this.form.value.priceYearly) return 0;
    const annualMonthly = this.form.value.priceMonthly * 12;
    const yearly = this.form.value.priceYearly;
    return Math.round(((annualMonthly - yearly) / annualMonthly) * 100);
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    const val = this.form.value;
    const dto: Partial<Package> = {
      name:            val.name,
      tier:            val.tier,
      speedMbps:       val.speedMbps,
      uploadSpeedMbps: val.uploadSpeedMbps,
      burstSpeed:      val.burstSpeed,
      priceMonthly:    val.priceMonthly,
      priceQuarterly:  val.priceQuarterly,
      priceYearly:     val.priceYearly,
      dataLimitGb:     val.dataLimitGb || undefined,
      validityDays:    val.validityDays,
      maxDevices:      val.maxDevices,
      description:     val.description,
      isActive:        val.isActive,
      features:        this.featuresArray.value,
    };

    const req$ = this.isEdit
      ? this.packageService.update(this.packageId!, dto)
      : this.packageService.create(dto);

    req$.subscribe({
      next: () => { this.saving = false; this.router.navigate(['/packages']); },
      error: (e) => {
        console.error('Save error:', e);
        this.saving = false;
      }
    });
  }

  cancel() { this.router.navigate(['/packages']); }
}