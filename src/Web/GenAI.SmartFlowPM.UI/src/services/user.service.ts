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
      const url = `/users${this.buildQueryParams({ pageNumber: page, pageSize })}`;
      
      const response = await this.get<PaginatedResponse<UserDto>>(url);
      
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
        
        // If it's a direct user array response (non-paginated)
        if ('length' in response) {
          return response as unknown as UserDto[];
        }
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  async getUsersPaginated(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<UserDto>> {
    try {
      const url = `/users${this.buildQueryParams({ pageNumber: page, pageSize })}`;
      return await this.get<PaginatedResponse<UserDto>>(url);
    } catch (error) {
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
    try {
      // Use the users endpoint with searchTerm parameter
      const url = `/users${this.buildQueryParams({ 
        pageNumber: page, 
        pageSize, 
        searchTerm 
      })}`;
      const response = await this.get<PaginatedResponse<UserDto>>(url);
      return response.items || []; // Extract the items array from paginated response
    } catch (error) {
      console.warn('Search failed, returning empty results');
      return [];
    }
  }

  // Quick search for autocomplete (returns limited results)
  async searchUsersQuick(searchTerm: string, limit: number = 20): Promise<UserDto[]> {
    try {
      // Use the users endpoint with searchTerm parameter
      const url = `/users${this.buildQueryParams({ 
        pageNumber: 1, 
        pageSize: limit, 
        searchTerm 
      })}`;
      const response = await this.get<PaginatedResponse<UserDto>>(url);
      
      // Handle different response formats
      if (response && typeof response === 'object') {
        // If it's a paginated response with 'items' property
        if ('items' in response && Array.isArray(response.items)) {
          return response.items;
        }
        
        // If it's a paginated response with 'data' property
        if ('data' in response && Array.isArray(response.data)) {
          return response.data;
        }
        
        // If it's a direct array response
        if (Array.isArray(response)) {
          return response;
        }
      }
      
      return [];
    } catch (error) {
      console.warn('Quick search failed, returning empty results');
      return [];
    }
  }

  // Get active users for initial dropdown load
  async getActiveUsers(limit: number = 10): Promise<UserDto[]> {
    try {
      // Just use the regular users endpoint with a small limit
      return this.getUsers(1, limit);
    } catch (error) {
      console.warn('Could not load users');
      return [];
    }
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
