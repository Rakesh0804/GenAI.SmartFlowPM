// Role module interfaces
export interface RoleDto {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateRoleDto {
  name: string;
  description?: string;
  isActive: boolean;
}
