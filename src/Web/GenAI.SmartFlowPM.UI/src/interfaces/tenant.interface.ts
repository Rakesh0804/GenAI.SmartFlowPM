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

export interface TenantFormData {
  name: string;
  subDomain: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionPlan: string;
  maxUsers: number;
  maxProjects: number;
  timeZone: string;
  currency: string;
  logoUrl: string;
}

export const SUBSCRIPTION_PLANS = [
  'Basic',
  'Standard',
  'Premium',
  'Enterprise'
] as const;

export const TIMEZONES = [
  'UTC',
  'EST',
  'CST',
  'MST',
  'PST',
  'GMT',
  'CET'
] as const;

export const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY',
  'INR'
] as const;

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[number];
export type TimeZone = typeof TIMEZONES[number];
export type Currency = typeof CURRENCIES[number];
