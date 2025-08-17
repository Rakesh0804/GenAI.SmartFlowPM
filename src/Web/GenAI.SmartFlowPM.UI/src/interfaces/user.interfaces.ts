// User module interfaces
import { TeamMemberRole } from './enums.interfaces';

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  managerId?: string;
  hasReportee: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
  updatedBy?: string;
  roles: string[];
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  password: string;
  managerId?: string;
  hasReportee: boolean;
  roleIds?: string[];
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  phoneNumber?: string;
  managerId?: string;
  hasReportee?: boolean;
  isActive?: boolean;
  roleIds?: string[];
}

export interface UserSummaryDto {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  hasReportee: boolean;
}
