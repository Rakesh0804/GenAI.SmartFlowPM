import { BaseApiService } from '../lib/base-api.service';
import { 
  TenantDto, 
  CreateTenantDto, 
  UpdateTenantDto, 
  TenantSummaryDto,
  PaginatedResponse 
} from '../types/api.types';

export class TenantService extends BaseApiService {
  private static instance: TenantService;

  static getInstance(): TenantService {
    if (!TenantService.instance) {
      TenantService.instance = new TenantService();
    }
    return TenantService.instance;
  }

  async getTenants(page: number = 1, pageSize: number = 10): Promise<TenantDto[]> {
    try {
      const url = `/tenants${this.buildQueryParams({ pageNumber: page, pageSize })}`;
      
      const response = await this.get<PaginatedResponse<TenantDto>>(url);
      
      // Handle different response formats
      if (response && typeof response === 'object') {
        // If it's already an array
        if (Array.isArray(response)) {
          return response;
        }
        
        // If it's a paginated response with 'items' property (actual API format)
        if ('items' in response && Array.isArray(response.items)) {
          return response.items;
        }
        
        // If it's a paginated response with 'data' property
        if ('data' in response && Array.isArray(response.data)) {
          return response.data;
        }
        
        // If it's a direct tenant array response (non-paginated)
        if (Array.isArray((response as any).tenants)) {
          return (response as any).tenants;
        }
      }
      
      console.warn('Unexpected response format:', response);
      return [];
      
    } catch (error) {
      console.error('Error fetching tenants:', error);
      throw error;
    }
  }

  async getTenantsPaginated(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<TenantDto>> {
    try {
      const url = `/tenants${this.buildQueryParams({ pageNumber: page, pageSize })}`;
      return await this.get<PaginatedResponse<TenantDto>>(url);
    } catch (error) {
      console.error('Error fetching paginated tenants:', error);
      throw error;
    }
  }

  async getTenantById(id: string): Promise<TenantDto> {
    try {
      return await this.get<TenantDto>(`/tenants/${id}`);
    } catch (error) {
      console.error('Error fetching tenant by ID:', error);
      throw error;
    }
  }

  async getTenantBySubdomain(subdomain: string): Promise<TenantDto> {
    try {
      return await this.get<TenantDto>(`/tenants/subdomain/${subdomain}`);
    } catch (error) {
      console.error('Error fetching tenant by subdomain:', error);
      throw error;
    }
  }

  async getActiveTenants(): Promise<TenantDto[]> {
    try {
      const response = await this.get<TenantDto[]>('/tenants/active');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching active tenants:', error);
      throw error;
    }
  }

  async searchTenants(searchTerm: string, page: number = 1, pageSize: number = 10): Promise<TenantDto[]> {
    try {
      const url = `/tenants/search${this.buildQueryParams({ searchTerm, pageNumber: page, pageSize })}`;
      const response = await this.get<PaginatedResponse<TenantDto>>(url);
      
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          return response;
        }
        if ('items' in response && Array.isArray(response.items)) {
          return response.items;
        }
        if ('data' in response && Array.isArray(response.data)) {
          return response.data;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error searching tenants:', error);
      throw error;
    }
  }

  async createTenant(tenant: CreateTenantDto): Promise<TenantDto> {
    try {
      return await this.post<TenantDto>('/tenants', tenant);
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  }

  async updateTenant(id: string, tenant: UpdateTenantDto): Promise<TenantDto> {
    try {
      return await this.put<TenantDto>(`/tenants/${id}`, tenant);
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }
  }

  async deleteTenant(id: string): Promise<void> {
    try {
      await this.delete(`/tenants/${id}`);
    } catch (error) {
      console.error('Error deleting tenant:', error);
      throw error;
    }
  }

  async activateTenant(id: string): Promise<TenantDto> {
    try {
      return await this.patch<TenantDto>(`/tenants/${id}/activate`, {});
    } catch (error) {
      console.error('Error activating tenant:', error);
      throw error;
    }
  }

  async deactivateTenant(id: string): Promise<TenantDto> {
    try {
      return await this.patch<TenantDto>(`/tenants/${id}/deactivate`, {});
    } catch (error) {
      console.error('Error deactivating tenant:', error);
      throw error;
    }
  }

  // Additional utility methods
  isValidSubdomain(subdomain: string): boolean {
    // Subdomain validation: alphanumeric and hyphens, 3-63 characters
    const subdomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{1,61}[a-zA-Z0-9])?$/;
    return subdomainRegex.test(subdomain);
  }

  formatTenantAddress(tenant: TenantDto): string {
    const parts = [
      tenant.address,
      tenant.city,
      tenant.state,
      tenant.postalCode,
      tenant.country
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  getTenantStatus(tenant: TenantDto): { label: string; color: string } {
    if (!tenant.isActive) {
      return { label: 'Inactive', color: 'red' };
    }
    
    if (tenant.subscriptionEndDate) {
      const endDate = new Date(tenant.subscriptionEndDate);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) {
        return { label: 'Expired', color: 'red' };
      } else if (daysUntilExpiry <= 30) {
        return { label: 'Expiring Soon', color: 'yellow' };
      }
    }
    
    return { label: 'Active', color: 'green' };
  }

  getSubscriptionDaysRemaining(tenant: TenantDto): number | null {
    if (!tenant.subscriptionEndDate) return null;
    
    const endDate = new Date(tenant.subscriptionEndDate);
    const now = new Date();
    return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }
}

// Export singleton instance
export const tenantService = TenantService.getInstance();
