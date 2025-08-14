'use client';

import React, { useState } from 'react';
import { ClaimDto } from '@/types/api.types';
import { ClaimCockpit } from '@/components/claims/ClaimCockpit';
import { NewClaim } from '@/components/claims/NewClaim';
import { EditClaim } from '@/components/claims/EditClaim';
import { ViewClaim } from '@/components/claims/ViewClaim';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

interface ClaimPageState {
  mode: ViewMode;
  selectedClaim?: ClaimDto;
}

export default function ClaimsPage() {
  const [pageState, setPageState] = useState<ClaimPageState>({ mode: 'list' });

  const handleNewClaim = () => {
    setPageState({ mode: 'create' });
  };

  const handleEditClaim = (claim: ClaimDto) => {
    setPageState({ mode: 'edit', selectedClaim: claim });
  };

  const handleViewClaim = (claim: ClaimDto) => {
    setPageState({ mode: 'view', selectedClaim: claim });
  };

  const handleBackToList = () => {
    setPageState({ mode: 'list' });
  };

  const handleSuccess = () => {
    // After successful create/edit, go back to list
    setPageState({ mode: 'list' });
  };

  // Render based on current mode
  switch (pageState.mode) {
    case 'create':
      return (
        <NewClaim
          onBack={handleBackToList}
          onClaimCreated={handleSuccess}
        />
      );

    case 'edit':
      if (!pageState.selectedClaim) {
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No claim selected for editing</p>
          </div>
        );
      }
      return (
        <EditClaim
          claimId={pageState.selectedClaim.id}
          onBack={handleBackToList}
          onClaimUpdated={handleSuccess}
        />
      );

    case 'view':
      if (!pageState.selectedClaim) {
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No claim selected for viewing</p>
          </div>
        );
      }
      return (
        <ViewClaim
          claimId={pageState.selectedClaim.id}
          onBack={handleBackToList}
        />
      );

    case 'list':
    default:
      return (
        <ClaimCockpit
          onAddNew={handleNewClaim}
          onEdit={handleEditClaim}
          onView={handleViewClaim}
        />
      );
  }
}
