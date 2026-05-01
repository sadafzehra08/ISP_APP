export interface Package {
  id?: number;
  name: string;
  speedMbps: number;
  priceMonthly: number;
  dataLimitGb?: number;
  validityDays: number;
  description?: string;
  isActive: boolean;
  subscribersCount?: number;
}