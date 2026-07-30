export interface Package {
  id: number;
  name: string;
  tier: 'basic' | 'advanced' | 'silver' | 'premium';
  speed?: string;             // "10 Mbps" display k liye
  speedMbps: number;
  uploadSpeedMbps: number;
  burstSpeed?: number;
  priceMonthly: number;
  priceQuarterly?: number;
  priceYearly?: number;
  dataLimitGb?: number;       // null = unlimited
  validityDays: number;
  maxDevices: number;
  features: string[];         // backend se JSON parse hoga
  description?: string;
  color?: string;
  isActive: boolean;
  createdAt?: string;

  // subscribersCount backend se calculate hoga
  subscribersCount?: number;
}

