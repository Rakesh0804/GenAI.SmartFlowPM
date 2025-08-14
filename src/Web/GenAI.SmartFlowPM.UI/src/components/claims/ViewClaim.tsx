'use client';

import React from 'react';
import { ClaimDto } from '@/types/api.types';
import { EditClaim } from './EditClaim';

interface ViewClaimProps {
  claimId: string;
  onBack?: () => void;
  onCancel?: () => void;
}

export const ViewClaim: React.FC<ViewClaimProps> = ({
  claimId,
  onBack,
  onCancel
}) => {
  return (
    <EditClaim
      claimId={claimId}
      onBack={onBack}
      onCancel={onCancel}
      readOnly={true}
    />
  );
};

export default ViewClaim;
