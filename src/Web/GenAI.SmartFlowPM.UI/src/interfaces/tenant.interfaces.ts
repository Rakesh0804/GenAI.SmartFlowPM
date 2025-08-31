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
  maxUsers: string;
  maxProjects: string;
  timeZone: string;
  currency: string;
  logoUrl: string;
}

// Constants for tenant form options
export const SUBSCRIPTION_PLANS = [
  { value: 'basic', label: 'Basic Plan', maxUsers: 10, maxProjects: 50 },
  { value: 'standard', label: 'Standard Plan', maxUsers: 50, maxProjects: 200 },
  { value: 'premium', label: 'Premium Plan', maxUsers: 100, maxProjects: 500 },
  { value: 'enterprise', label: 'Enterprise Plan', maxUsers: -1, maxProjects: -1 } // -1 means unlimited
];

export const TIMEZONES = [
  { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
  { value: 'Europe/Moscow', label: 'Moscow Time (MSK)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  { value: 'Pacific/Auckland', label: 'New Zealand Standard Time (NZST)' }
];

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
  { value: 'CHF', label: 'Swiss Franc (CHF)', symbol: 'CHF' },
  { value: 'CNY', label: 'Chinese Yuan (¥)', symbol: '¥' },
  { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
  { value: 'KRW', label: 'South Korean Won (₩)', symbol: '₩' },
  { value: 'SGD', label: 'Singapore Dollar (S$)', symbol: 'S$' },
  { value: 'NZD', label: 'New Zealand Dollar (NZ$)', symbol: 'NZ$' }
];
