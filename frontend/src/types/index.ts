// 统一门户系统共享类型定义

export type Target = 'sales' | 'test';
export type SystemType = 'internal' | 'external';

export interface AdminUser {
  id: number;
  username: string;
  password: string;
}

export interface System {
  id: number;
  name: string;
  type: SystemType;
  externalUrl: string;
  imageUrl: string;
  target: Target;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortalConfig {
  id: number;
  target: Target;
  backgroundImage: string | null;
  adminUrl: string | null;
  ipAddress: string | null;
  externalSystemUrl: string | null;
  updatedAt: Date;
}

export interface LoginResponse {
  access_token: string;
}

// DTO 类型
export interface CreateSystemDto {
  name: string;
  type: SystemType;
  externalUrl: string;
  imageUrl: string;
  target: Target;
}

export interface UpdateSystemDto {
  name?: string;
  type?: SystemType;
  externalUrl?: string;
  imageUrl?: string;
}

export interface UpdatePortalConfigDto {
  backgroundImage?: string;
  adminUrl?: string;
  ipAddress?: string;
  externalSystemUrl?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}
