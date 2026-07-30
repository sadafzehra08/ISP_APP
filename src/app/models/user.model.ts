// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: 'admin' | 'manager' | 'staff';
//   token: string;
//   isActive: boolean;
// }

export interface AppUser {
  id:         number;
  companyId:  number;
  fullName:   string;
  username:   string;
  email?:     string;
  role:       'superadmin' | 'admin' | 'user' | 'viewer';
  isActive:   boolean;
  lastLogin?: string;
  createdAt:  string;
}

export interface PagedUserResult {
  data:       AppUser[];
  totalCount: number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface UserFilter {
  search?:  string;
  role?:    string;
  page:     number;
  pageSize: number;
}

export interface UserCreateDto {
  fullName: string;
  username: string;
  email?:   string;
  password: string;
  role:     string;
}

export interface UserUpdateDto {
  fullName: string;
  email?:   string;
  role:     string;
  isActive: boolean;
}

export interface ChangePasswordDto {
  newPassword: string;
}
