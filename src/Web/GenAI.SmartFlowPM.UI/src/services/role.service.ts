import { BaseApiService } from '../lib/base-api.service';
import { RoleDto, CreateRoleDto, UpdateRoleDto, PaginatedResponse } from '@/types/api.types';

class RoleService extends BaseApiService {
  /**
   * Get paginated list of roles
   */
  async getRoles(
    pageNumber: number = 1,
    pageSize: number = 12,
    searchTerm?: string
  ): Promise<PaginatedResponse<RoleDto>> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(searchTerm && { searchTerm }),
    });

    return this.get<PaginatedResponse<RoleDto>>(`/Role?${params}`);
  }

  /**
   * Get all roles (no pagination) for dropdowns
   */
  async getAllRoles(): Promise<RoleDto[]> {
    const result = await this.get<PaginatedResponse<RoleDto>>('/Role?pageSize=100');
    return result.items;
  }

  /**
   * Get role by ID
   */
  async getRoleById(id: string): Promise<RoleDto> {
    return this.get<RoleDto>(`/Role/${id}`);
  }

  /**
   * Create new role
   */
  async createRole(roleData: CreateRoleDto): Promise<RoleDto> {
    return this.post<RoleDto>('/Role', roleData);
  }

  /**
   * Update existing role
   */
  async updateRole(id: string, roleData: UpdateRoleDto): Promise<RoleDto> {
    return this.put<RoleDto>(`/Role/${id}`, roleData);
  }

  /**
   * Delete role (soft delete)
   */
  async deleteRole(id: string): Promise<void> {
    return this.delete(`/Role/${id}`);
  }

  /**
   * Toggle role status (activate/deactivate)
   */
  async toggleRoleStatus(id: string, isActive: boolean): Promise<void> {
    const currentRole = await this.getRoleById(id);
    await this.updateRole(id, { ...currentRole, isActive });
  }
}

export const roleService = new RoleService();
