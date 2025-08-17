// Team module interfaces
import { TeamMemberRole } from './enums.interfaces';

export interface TeamDto {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  leaderName: string;
  memberCount: number;
  projectCount: number;
  taskCount: number;
  completedTaskCount: number;
  isActive: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTeamDto {
  name: string;
  description?: string;
  leaderId: string;
  isActive?: boolean;
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  leaderId?: string;
  isActive?: boolean;
}

export interface TeamMemberDto {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: TeamMemberRole;
  joinedDate: Date;
  isActive: boolean;
}

export interface AddTeamMemberDto {
  teamId: string;
  userId: string;
  role: TeamMemberRole;
}

export interface UpdateTeamMemberDto {
  role?: TeamMemberRole;
  isActive?: boolean;
}
