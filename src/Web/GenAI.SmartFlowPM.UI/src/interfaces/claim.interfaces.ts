// Claim module interfaces
export interface ClaimDto {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateClaimDto {
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateClaimDto {
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}
