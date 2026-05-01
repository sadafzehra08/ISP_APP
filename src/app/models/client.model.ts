export interface Client {
  id?: number;
  clientCode?: string;
  fullName: string;
  cnic: string;
  phone: string;
  email?: string;
  address: string;
  areaId: number;
  areaName?: string;
  packageId: number;
  packageName?: string;
  status: 'active' | 'suspended' | 'disconnected';
  connectionDate: string;
  ipAddress?: string;
  expiryDate?: string;
  createdAt?: string;
}

export interface Area {
  id: number;
  name: string;
  city: string;
}

export interface ClientFilter {
  search?: string;
  status?: string;
  areaId?: number;
  packageId?: number;
  page: number;
  pageSize: number;
}