// ── package-list.ts ── Real API ───────────────────────────────────────────
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Package } from '../../../models/package.model';
import { PackageService } from '../../../core/services/package.service';

@Component({
  selector:    'app-package-list',
  standalone:  false,
  templateUrl: './package-list.html',
  styleUrl:    './package-list.scss',
})
export class PackageList implements OnInit {

  packages: Package[] = [];
  loading   = false;

  showDeleteModal = false;
  showToggleModal = false;
  packageToDelete: Package | null = null;
  packageToToggle: Package | null = null;
  filterStatus = 'all';
  viewMode: 'cards' | 'table' = 'cards';

  constructor(
    private router:         Router,
    private packageService: PackageService,
    private cdr:            ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadPackages(); }

  loadPackages() {
    this.loading = true;
    this.packageService.getAll().subscribe({
      next: (data) => {
        this.packages = data;
        this.loading  = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Package load error:', e);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredPackages(): Package[] {
    if (this.filterStatus === 'active')   return this.packages.filter(p => p.isActive);
    if (this.filterStatus === 'inactive') return this.packages.filter(p => !p.isActive);
    return this.packages;
  }

  get stats() {
    return {
      total: this.packages.length,
      active: this.packages.filter(p => p.isActive).length,
      totalSubscribers: this.packages.reduce((s, p) => s + (p.subscribersCount || 0), 0),
      avgPrice: this.packages.length
        ? Math.round(this.packages.reduce((s, p) => s + p.priceMonthly, 0) / this.packages.length)
        : 0,
    };
  }

  getTierConfig(tier: string) {
    const configs: any = {
      basic:    { label: 'Basic',    icon: '🌐', gradient: 'linear-gradient(135deg, #0066aa, var(--primary))', glow: 'var(--border-hover)',    badge: 'rgba(0,180,255,0.15)',    badgeText: 'var(--primary)' },
      advanced: { label: 'Advanced', icon: '⚡', gradient: 'linear-gradient(135deg, #007a50, var(--green))', glow: 'rgba(0,229,160,0.3)',    badge: 'rgba(0,229,160,0.15)',    badgeText: 'var(--green)' },
      silver:   { label: 'Silver',   icon: '🥈', gradient: 'linear-gradient(135deg, #666, #c0c0c0)',    glow: 'rgba(192,192,192,0.3)', badge: 'rgba(192,192,192,0.15)', badgeText: '#c0c0c0' },
      premium:  { label: 'Premium',  icon: '👑', gradient: 'linear-gradient(135deg, #a07000, #ffd700)', glow: 'rgba(255,215,0,0.3)',    badge: 'rgba(255,215,0,0.15)',    badgeText: '#ffd700' },
    };
    return configs[tier] || configs['basic'];
  }

  editPackage(id: number) { this.router.navigate(['/packages', id, 'edit']); }

  // ── Delete ───────────────────────────────────────────────────────────
  confirmDelete(pkg: Package) { this.packageToDelete = pkg; this.showDeleteModal = true; }

  deleteConfirmed() {
    if (!this.packageToDelete) return;
    this.packageService.delete(this.packageToDelete.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.packageToDelete = null;
        this.loadPackages();
      },
      error: (e) => {
        alert(e.error?.message || 'Cannot delete this package');
        this.showDeleteModal = false;
        this.packageToDelete = null;
      }
    });
  }

  // ── Toggle Status ────────────────────────────────────────────────────
  confirmToggle(pkg: Package) { this.packageToToggle = pkg; this.showToggleModal = true; }

  toggleConfirmed() {
    if (!this.packageToToggle) return;
    this.packageService.toggleStatus(this.packageToToggle.id).subscribe({
      next: () => {
        this.showToggleModal = false;
        this.packageToToggle = null;
        this.loadPackages();
      },
      error: (e) => {
        console.error('Toggle error:', e);
        this.showToggleModal = false;
      }
    });
  }

  formatSpeed(mbps: number): string {
    return mbps >= 1000 ? (mbps / 1000) + ' Gbps' : mbps + ' Mbps';
  }

  formatPrice(price: number): string {
    return '₨' + price.toLocaleString();
  }
}