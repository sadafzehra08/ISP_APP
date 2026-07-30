// export interface Client {
//   id?: number;
//   clientCode?: string;
//   fullName: string;
//   cnic: string;
//   phone: string;
//   email?: string;
//   address: string;
//   areaId: number;
//   areaName?: string;
//   packageId: number;
//   packageName?: string;
//   status: 'active' | 'suspended' | 'disconnected';
//   connectionDate: string;
//   ipAddress?: string;
//   expiryDate?: string;
//   createdAt?: string;
// }

// export interface Area {
//   id: number;
//   name: string;
//   city: string;
// }

// export interface ClientFilter {
//   search?: string;
//   status?: string;
//   areaId?: number;
//   packageId?: number;
//   page: number;
//   pageSize: number;
// }



// models/client.model.ts

export interface Client {
  id?: number;
  clientCode?: string;
  companyId?: number;
  userId?: number;
  createdByName?: string;
    clientName: string;   // ← NEW

  fullName: string;
  cnic: string;
  phone: string;
  email?: string;
  address: string;
  areaId?: number;
areaName?: string;

packageId?: number;
packageName?: string;
  area?: Area;           // object
  package?: Package;     // object
  status: 'active' | 'suspended' | 'disconnected';
  ipAddress?: string;
  connectionDate: string;
  expiryDate?: string;
  createdAt?: string;
}

export interface ClientCreateDto {
    clientName: string; 
  fullName: string;
  cnic: string;
  phone: string;
  email?: string;
  address: string;
  areaId: number;
  packageId: number;
  status: 'active' | 'suspended' | 'disconnected';
  ipAddress?: string;
  connectionDate: string;
  expiryDate?: string;
}

export interface ClientUpdateDto extends ClientCreateDto {
  id: number;
}

export interface Area {
  id: number;
  name: string;
  city: string;
  isActive?: boolean;
  createdAt?: string;
}

// export interface Package {
//   id: number;
//   name: string;
//   speed?: string;
//   monthlyFee: number;
//   isActive?: boolean;
//   createdAt?: string;
// }
export interface Package {
  id: number;
  name: string;
  speed?: string;        // purana — rakho
  monthlyFee: number;    // purana — rakho
  tier?: string;         // naya
  speedMbps?: number;    // naya
  uploadSpeedMbps?: number;
  priceMonthly?: number; // naya ← yeh main fix hai
  priceQuarterly?: number;
  priceYearly?: number;
  isActive?: boolean;
  createdAt?: string;
}
export interface ClientFilter {
  search?: string;
  status?: string;
  areaId?: number;
  packageId?: number;
  page: number;
  pageSize: number;
}

export interface PagedResult<T> {
  data: T[];
  totalCount: number;    // backend "totalCount" return karta hai
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ClientStatus = 'active' | 'suspended' | 'disconnected';