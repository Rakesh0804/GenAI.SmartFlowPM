import { BaseApiService } from '../lib/base-api.service';
import { 
  TeamDto, 
  CreateTeamDto, 
  UpdateTeamDto, 
  TeamMemberDto, 
  AddTeamMemberDto, 
  UpdateTeamMemberDto, 
  PaginatedResponse 
} from '../types/api.types';

export class TeamService extends BaseApiService {
  private static instance: TeamService;

  static getInstance(): TeamService {
    if (!TeamService.instance) {
      TeamService.instance = new TeamService();
    }
    return TeamService.instance;
  }
  // Team CRUD operations
  async getTeams(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<TeamDto> | TeamDto[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });
    return this.get<PaginatedResponse<TeamDto>>(`/teams?${params}`);
  }

  async getTeam(id: string): Promise<TeamDto> {
    return this.get<TeamDto>(`/teams/${id}`);
  }

  async createTeam(team: CreateTeamDto): Promise<TeamDto> {
    return this.post<TeamDto>('/teams', team);
  }

  async updateTeam(id: string, team: UpdateTeamDto): Promise<TeamDto> {
    return this.put<TeamDto>(`/teams/${id}`, team);
  }

  async deleteTeam(id: string): Promise<void> {
    return this.delete(`/teams/${id}`);
  }

  async searchTeams(query: string, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<TeamDto> | TeamDto[]> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      pageSize: pageSize.toString()
    });
    return this.get<PaginatedResponse<TeamDto>>(`/teams/search?${params}`);
  }

  // Team Member operations
  async getTeamMembers(teamId: string): Promise<TeamMemberDto[]> {
    return this.get<TeamMemberDto[]>(`/teams/${teamId}/members`);
  }

  async addTeamMember(member: AddTeamMemberDto): Promise<TeamMemberDto> {
    return this.post<TeamMemberDto>('/teams/members', member);
  }

  async updateTeamMember(teamId: string, userId: string, member: UpdateTeamMemberDto): Promise<TeamMemberDto> {
    return this.put<TeamMemberDto>(`/teams/${teamId}/members/${userId}`, member);
  }

  async removeTeamMember(teamId: string, userId: string): Promise<void> {
    return this.delete(`/teams/${teamId}/members/${userId}`);
  }

  // Team statistics and analytics
  async getTeamStats(teamId: string): Promise<any> {
    return this.get<any>(`/teams/${teamId}/stats`);
  }

  async getActiveTeams(): Promise<TeamDto[]> {
    return this.get<TeamDto[]>('/teams/active');
  }

  async getUserTeams(userId: string): Promise<TeamDto[]> {
    return this.get<TeamDto[]>(`/teams/user/${userId}`);
  }
}

export const teamService = TeamService.getInstance();
