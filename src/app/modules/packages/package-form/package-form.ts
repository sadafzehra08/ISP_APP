

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Package } from '../../../models/package.model';

@Component({
  selector: 'app-package-form',
  standalone: false,
  templateUrl: './package-form.html',
  styleUrl: './package-form.scss',
})
export class PackageForm implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;
  newFeature = '';

  tierOptions = [
    { value: 'basic',    label: 'Basic',   icon: '🌐' },
    { value: 'advanced', label: 'Advanced', icon: '⚡' },
    { value: 'silver',   label: 'Silver',   icon: '🥈' },
    { value: 'premium',  label: 'Premium',  icon: '👑' },
  ];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.isEdit = !!this.route.snapshot.params['id'];
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
    const defaultFeatures = ['Unlimited Data', '10 Mbps Download', 'Basic Support'];
    defaultFeatures.forEach(f => this.featuresArray.push(this.fb.control(f)));
    this.form.patchValue({ name: 'Basic', tier: 'basic', speedMbps: 10, uploadSpeedMbps: 5, burstSpeed: 15, priceMonthly: 1200, priceQuarterly: 3300, priceYearly: 12000, validityDays: 30, maxDevices: 2, description: 'Perfect for basic use.', isActive: true });
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
    const colors: any = { basic: '#00b4ff', advanced: '#00e5a0', silver: '#c0c0c0', premium: '#ffd700' };
    return colors[this.form.value.tier] || '#00b4ff';
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
    setTimeout(() => { this.saving = false; this.router.navigate(['/packages']); }, 800);
  }

  cancel() { this.router.navigate(['/packages']); }
}