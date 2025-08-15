import { BaseApiService } from '../lib/base-api.service';
import { 
  OrganizationDto, 
  CreateOrganizationDto, 
  UpdateOrganizationDto,
  OrganizationWithBranchesDto,
  BranchDto,
  CreateBranchDto,
  UpdateBranchDto,
  BranchWithManagerDto,
  PaginatedResponse
} from '@/types/api.types';

class OrganizationService extends BaseApiService {

  // Organization methods
  async getAllOrganizations(pageNumber: number = 1, pageSize: number = 10): Promise<PaginatedResponse<OrganizationDto>> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    });

    return this.get<PaginatedResponse<OrganizationDto>>(`/organizations?${params}`);
  }

  async getAllOrganizationsWithBranches(pageNumber: number = 1, pageSize: number = 10): Promise<PaginatedResponse<OrganizationWithBranchesDto>> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    });

    return this.get<PaginatedResponse<OrganizationWithBranchesDto>>(`/organizations/with-branches?${params}`);
  }

  async getOrganizationById(id: string): Promise<OrganizationDto> {
    return this.get<OrganizationDto>(`/organizations/${id}`);
  }

  async getOrganizationWithBranches(id: string): Promise<OrganizationWithBranchesDto> {
    return this.get<OrganizationWithBranchesDto>(`/organizations/${id}/with-branches`);
  }

  async createOrganization(data: CreateOrganizationDto): Promise<OrganizationDto> {
    return this.post<OrganizationDto>('/organizations', data);
  }

  async updateOrganization(id: string, data: UpdateOrganizationDto): Promise<OrganizationDto> {
    return this.put<OrganizationDto>(`/organizations/${id}`, data);
  }

  async deleteOrganization(id: string): Promise<void> {
    return this.delete(`/organizations/${id}`);
  }

  async toggleOrganizationStatus(id: string, isActive: boolean): Promise<OrganizationDto> {
    const organization = await this.getOrganizationById(id);
    const updateData: UpdateOrganizationDto = {
      name: organization.name,
      description: organization.description,
      website: organization.website,
      email: organization.email,
      phone: organization.phone,
      address: organization.address,
      city: organization.city,
      state: organization.state,
      country: organization.country,
      postalCode: organization.zipCode,
      logo: organization.logoUrl,
      establishedDate: organization.establishedDate,
      employeeCount: 0 // This would need to be tracked separately
    };
    
    return this.updateOrganization(id, updateData);
  }

  // Branch methods
  async getAllBranches(pageNumber: number = 1, pageSize: number = 10): Promise<PaginatedResponse<BranchWithManagerDto>> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    });

    return this.get<PaginatedResponse<BranchWithManagerDto>>(`/branches?${params}`);
  }

  async getBranchById(id: string): Promise<BranchWithManagerDto> {
    return this.get<BranchWithManagerDto>(`/branches/${id}`);
  }

  async getBranchesByOrganization(organizationId: string): Promise<BranchWithManagerDto[]> {
    return this.get<BranchWithManagerDto[]>(`/branches/organization/${organizationId}`);
  }

  async createBranch(data: CreateBranchDto): Promise<BranchDto> {
    return this.post<BranchDto>('/branches', data);
  }

  async updateBranch(id: string, data: UpdateBranchDto): Promise<BranchDto> {
    return this.put<BranchDto>(`/branches/${id}`, data);
  }

  async deleteBranch(id: string): Promise<void> {
    return this.delete(`/branches/${id}`);
  }

  async toggleBranchStatus(id: string, isActive: boolean): Promise<BranchDto> {
    const branch = await this.getBranchById(id);
    const updateData: UpdateBranchDto = {
      name: branch.name,
      code: branch.code,
      branchType: branch.branchType,
      description: branch.description,
      phone: branch.phone,
      email: branch.email,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      country: branch.country,
      postalCode: branch.postalCode,
      managerId: branch.managerId
    };
    
    return this.updateBranch(id, updateData);
  }

  // Utility methods
  getBranchTypeDisplay(branchType: number): string {
    switch (branchType) {
      case 1: return 'Headquarters';
      case 2: return 'Regional';
      case 3: return 'Satellite';
      case 4: return 'Remote';
      default: return 'Unknown';
    }
  }

  getBranchTypeOptions() {
    return [
      { value: 1, label: 'Headquarters' },
      { value: 2, label: 'Regional' },
      { value: 3, label: 'Satellite' },
      { value: 4, label: 'Remote' }
    ];
  }
}

export const organizationService = new OrganizationService();
