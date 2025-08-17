import { ClaimDto, CreateClaimDto, UpdateClaimDto, PaginatedResponse } from '@/types/api.types';
import { BaseApiService } from '../lib/base-api.service';

class ClaimService extends BaseApiService {
  private readonly baseEndpoint = '/claims';

  // Get paginated claims
  async getClaims(page: number = 1, pageSize: number = 10, searchTerm?: string): Promise<PaginatedResponse<ClaimDto>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchTerm?.trim()) {
      params.append('searchTerm', searchTerm.trim());
    }

    const response = await this.get<PaginatedResponse<ClaimDto>>(`${this.baseEndpoint}?${params}`);
    return response;
  }

  // Get all claims without pagination
  async getAllClaims(): Promise<ClaimDto[]> {
    const response = await this.get<PaginatedResponse<ClaimDto>>(`${this.baseEndpoint}?pageNumber=1&pageSize=100`);
    return response.items || [];
  }

  // Get active claims only
  async getActiveClaims(): Promise<ClaimDto[]> {
    const response = await this.get<ClaimDto[]>(`${this.baseEndpoint}/active`);
    return response;
  }

  // Get claim by ID
  async getClaimById(id: string): Promise<ClaimDto> {
    const response = await this.get<ClaimDto>(`${this.baseEndpoint}/${id}`);
    return response;
  }

  // Get claim by name
  async getClaimByName(name: string): Promise<ClaimDto> {
    const response = await this.get<ClaimDto>(`${this.baseEndpoint}/by-name/${encodeURIComponent(name)}`);
    return response;
  }

  // Create new claim
  async createClaim(claimData: CreateClaimDto): Promise<ClaimDto> {
    const response = await this.post<ClaimDto>(this.baseEndpoint, claimData);
    return response;
  }

  // Update existing claim
  async updateClaim(id: string, claimData: UpdateClaimDto): Promise<ClaimDto> {
    const response = await this.put<ClaimDto>(`${this.baseEndpoint}/${id}`, claimData);
    return response;
  }

  // Delete claim
  async deleteClaim(id: string): Promise<void> {
    await this.delete(`${this.baseEndpoint}/${id}`);
  }

  // Toggle claim status (activate/deactivate)
  async toggleClaimStatus(id: string, isActive: boolean): Promise<ClaimDto> {
    const claim = await this.getClaimById(id);
    const updateData: UpdateClaimDto = {
      name: claim.name,
      type: claim.type,
      description: claim.description,
      isActive: isActive
    };
    return await this.updateClaim(id, updateData);
  }
}

// Export singleton instance
export const claimService = new ClaimService();
