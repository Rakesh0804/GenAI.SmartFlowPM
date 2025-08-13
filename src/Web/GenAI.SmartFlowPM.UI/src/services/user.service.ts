import { BaseApiService } from '../lib/base-api.service';
import { UserDto, CreateUserDto, UpdateUserDto, PaginatedResponse } from '../types/api.types';

export class UserService extends BaseApiService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUsers(page: number = 1, pageSize: number = 10): Promise<UserDto[]> {
    try {
      const url = this.buildPaginationUrl('/users', page, pageSize);
      console.log('UserService: Making request to:', url);
      
      const response = await this.get<PaginatedResponse<UserDto>>(url);
      console.log('UserService: Raw response:', response);
      
      // Handle different response formats
      if (response && typeof response === 'object') {
        // If it's already an array
        if (Array.isArray(response)) {
          console.log('UserService: Response is array, returning directly');
          return response;
        }
        
        // If it's a paginated response with 'items' property (actual API format)
        if ('items' in response && Array.isArray(response.items)) {
          console.log('UserService: Found items array in paginated response');
          return response.items;
        }
        
        // If it's a paginated response with 'data' property
        if ('data' in response && Array.isArray(response.data)) {
          console.log('UserService: Found data array in paginated response');
          return response.data;
        }
        
        // If it's a direct user array response (non-paginated)
        if ('length' in response) {
          console.log('UserService: Response appears to be array-like');
          return response as unknown as UserDto[];
        }
      }
      
      console.warn('UserService: Unexpected response format, returning empty array');
      return [];
    } catch (error) {
      console.error('UserService: Error in getUsers:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserDto> {
    return this.get<UserDto>(`/users/${id}`);
  }

  async createUser(user: CreateUserDto): Promise<UserDto> {
    return this.post<UserDto>('/users', user);
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<UserDto> {
    return this.put<UserDto>(`/users/${id}`, user);
  }

  async deleteUser(id: string): Promise<void> {
    return this.delete(`/users/${id}`);
  }

  async getUserReportees(userId: string): Promise<UserDto[]> {
    return this.get<UserDto[]>(`/users/${userId}/reportees`);
  }

  // Additional utility methods
  async searchUsers(searchTerm: string, page: number = 1, pageSize: number = 10): Promise<UserDto[]> {
    const url = `/users/search${this.buildQueryParams({ q: searchTerm, page, pageSize })}`;
    const response = await this.get<PaginatedResponse<UserDto>>(url);
    return response.items; // Extract the items array from paginated response
  }

  async getUsersByRole(role: string, page: number = 1, pageSize: number = 10): Promise<UserDto[]> {
    const url = `/users/by-role${this.buildQueryParams({ role, page, pageSize })}`;
    const response = await this.get<PaginatedResponse<UserDto>>(url);
    return response.items; // Extract the items array from paginated response
  }

  async toggleUserStatus(id: string, isActive: boolean): Promise<UserDto> {
    return this.patch<UserDto>(`/users/${id}/status`, { isActive });
  }
}

// Export singleton instance
export const userService = UserService.getInstance();
