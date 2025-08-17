// Tenant module interfaces
export interface TenantDto {
  id: string;
  name: string;
  subDomain?: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isActive: boolean;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionPlan?: string;
  maxUsers: number;
  maxProjects: number;
  timeZone?: string;
  currency?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTenantDto {
  name: string;
  subDomain?: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionPlan?: string;
  maxUsers?: number;
  maxProjects?: number;
  timeZone?: string;
  currency?: string;
  logoUrl?: string;
}

export interface UpdateTenantDto extends CreateTenantDto {
  id: string;
  isActive?: boolean;
}

export interface TenantSummaryDto {
  id: string;
  name: string;
  subDomain?: string;
  contactEmail: string;
  isActive: boolean;
  subscriptionPlan?: string;
  maxUsers: number;
  maxProjects: number;
  createdAt: Date;
}
