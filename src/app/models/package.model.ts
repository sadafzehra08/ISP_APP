export interface Package {
  id?: number;
  name: string;
  tier: 'basic' | 'advanced' | 'silver' | 'premium';
  speedMbps: number;
  uploadSpeedMbps: number;
  priceMonthly: number;
  priceQuarterly?: number;
  priceYearly?: number;
  dataLimitGb?: number;          // null = unlimited
  validityDays: number;
  maxDevices: number;
  burstSpeed?: number;
  features: string[];
  isActive: boolean;
  subscribersCount?: number;
  description?: string;
  color?: string;
  createdAt?: string;
}