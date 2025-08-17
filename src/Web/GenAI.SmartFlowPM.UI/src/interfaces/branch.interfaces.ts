// Branch module interfaces
import { BranchType } from './enums.interfaces';
import { UserSummaryDto } from './user.interfaces';
import { OrganizationDto } from './organization.interfaces';

export interface BranchDto {
  id: string;
  organizationId: string;
  name: string;
  code?: string;
  branchType: BranchType;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  managerId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BranchWithManagerDto extends BranchDto {
  manager?: UserSummaryDto;
}

export interface OrganizationWithBranchesDto extends OrganizationDto {
  branches: BranchWithManagerDto[];
}

export interface CreateBranchDto {
  organizationId: string;
  name: string;
  code?: string;
  branchType: BranchType;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  managerId?: string;
}

export interface UpdateBranchDto {
  name: string;
  code?: string;
  branchType: BranchType;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  managerId?: string;
}
