export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserDto {
  id: number;
  fullName: string;
  username: string;
  email?: string;
  role: string;
  companyId: number;
  companyName: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: UserDto;
}