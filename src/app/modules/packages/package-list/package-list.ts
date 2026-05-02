

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Package } from '../../../models/package.model';

@Component({
  selector: 'app-package-list',
  standalone: false,
  templateUrl: './package-list.html',
  styleUrl: './package-list.scss',
})
export class PackageList implements OnInit {

  showDeleteModal = false;
  showToggleModal = false;
  packageToDelete: Package | null = null;
  packageToToggle: Package | null = null;
  filterStatus = 'all';
  viewMode: 'cards' | 'table' = 'cards';

  packages: Package[] = [
    {
      id: 1,
      name: 'Basic',
      tier: 'basic',
      speedMbps: 10,
      uploadSpeedMbps: 5,
      priceMonthly: 1200,
      priceQuarterly: 3300,
      priceYearly: 12000,
      dataLimitGb: undefined,
      validityDays: 30,
      maxDevices: 2,
      burstSpeed: 15,
      features: [
        'Unlimited Data',
        '10 Mbps Download',
        '5 Mbps Upload',
        'Up to 2 Devices',
        'Basic Support',
        '24/7 Network Uptime'
      ],
      isActive: true,
      subscribersCount: 412,
      description: 'Perfect for light browsing, social media and basic streaming.',
      color: '#00b4ff',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Advanced',
      tier: 'advanced',
      speedMbps: 25,
      uploadSpeedMbps: 12,
      priceMonthly: 2200,
      priceQuarterly: 6000,
      priceYearly: 22000,
      dataLimitGb: undefined,
      validityDays: 30,
      maxDevices: 4,
      burstSpeed: 35,
      features: [
        'Unlimited Data',
        '25 Mbps Download',
        '12 Mbps Upload',
        'Up to 4 Devices',
        'Priority Support',
        '99.5% Uptime SLA',
        'Free Installation'
      ],
      isActive: true,
      subscribersCount: 389,
      description: 'Great for families, HD streaming and work from home.',
      color: '#00e5a0',
      createdAt: '2024-01-01'
    },
    {
      id: 3,
      name: 'Silver',
      tier: 'silver',
      speedMbps: 50,
      uploadSpeedMbps: 25,
      priceMonthly: 3500,
      priceQuarterly: 9500,
      priceYearly: 36000,
      dataLimitGb: undefined,
      validityDays: 30,
      maxDevices: 6,
      burstSpeed: 65,
      features: [
        'Unlimited Data',
        '50 Mbps Download',
        '25 Mbps Upload',
        'Up to 6 Devices',
        'Dedicated Support',
        '99.9% Uptime SLA',
        'Free Installation',
        'Static IP Available',
        'Monthly Speed Report'
      ],
      isActive: true,
      subscribersCount: 287,
      description: 'Ideal for heavy users, 4K streaming and multi-device households.',
      color: '#c0c0c0',
      createdAt: '2024-01-01'
    },
    {
      id: 4,
      name: 'Premium',
      tier: 'premium',
      speedMbps: 100,
      uploadSpeedMbps: 50,
      priceMonthly: 5500,
      priceQuarterly: 15000,
      priceYearly: 58000,
      dataLimitGb: undefined,
      validityDays: 30,
      maxDevices: 10,
      burstSpeed: 130,
      features: [
        'Unlimited Data',
        '100 Mbps Download',
        '50 Mbps Upload',
        'Unlimited Devices',
        'VIP 24/7 Support',
        '99.99% Uptime SLA',
        'Free Installation',
        'Free Static IP',
        'Monthly Speed Report',
        'Priority Network Lane',
        'Dedicated Account Manager'
      ],
      isActive: true,
      subscribersCount: 160,
      description: 'Enterprise-grade connection for businesses and power users.',
      color: '#ffd700',
      createdAt: '2024-01-01'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  get filteredPackages(): Package[] {
    if (this.filterStatus === 'active') return this.packages.filter(p => p.isActive);
    if (this.filterStatus === 'inactive') return this.packages.filter(p => !p.isActive);
    return this.packages;
  }

  get stats() {
    return {
      total: this.packages.length,
      active: this.packages.filter(p => p.isActive).length,
      totalSubscribers: this.packages.reduce((s, p) => s + (p.subscribersCount || 0), 0),
      avgPrice: Math.round(this.packages.reduce((s, p) => s + p.priceMonthly, 0) / this.packages.length),
    };
  }

  getTierConfig(tier: string) {
    const configs: any = {
      basic:    { label: 'Basic',    icon: '🌐', gradient: 'linear-gradient(135deg, #0066aa, #00b4ff)', glow: 'rgba(0,180,255,0.3)',    badge: 'rgba(0,180,255,0.15)',    badgeText: '#00b4ff' },
      advanced: { label: 'Advanced', icon: '⚡', gradient: 'linear-gradient(135deg, #007a50, #00e5a0)', glow: 'rgba(0,229,160,0.3)',    badge: 'rgba(0,229,160,0.15)',    badgeText: '#00e5a0' },
      silver:   { label: 'Silver',   icon: '🥈', gradient: 'linear-gradient(135deg, #666, #c0c0c0)',    glow: 'rgba(192,192,192,0.3)', badge: 'rgba(192,192,192,0.15)', badgeText: '#c0c0c0' },
      premium:  { label: 'Premium',  icon: '👑', gradient: 'linear-gradient(135deg, #a07000, #ffd700)', glow: 'rgba(255,215,0,0.3)',    badge: 'rgba(255,215,0,0.15)',    badgeText: '#ffd700' },
    };
    return configs[tier] || configs['basic'];
  }

  editPackage(id: number) { this.router.navigate(['/packages', id, 'edit']); }

  confirmDelete(pkg: Package) { this.packageToDelete = pkg; this.showDeleteModal = true; }
  deleteConfirmed() {
    if (this.packageToDelete) this.packages = this.packages.filter(p => p.id !== this.packageToDelete!.id);
    this.showDeleteModal = false; this.packageToDelete = null;
  }

  confirmToggle(pkg: Package) { this.packageToToggle = pkg; this.showToggleModal = true; }
  toggleConfirmed() {
    if (this.packageToToggle) {
      const found = this.packages.find(p => p.id === this.packageToToggle!.id);
      if (found) found.isActive = !found.isActive;
    }
    this.showToggleModal = false; this.packageToToggle = null;
  }

  formatSpeed(mbps: number): string {
    return mbps >= 1000 ? (mbps / 1000) + ' Gbps' : mbps + ' Mbps';
  }

  formatPrice(price: number): string {
    return '₨' + price.toLocaleString();
  }
}