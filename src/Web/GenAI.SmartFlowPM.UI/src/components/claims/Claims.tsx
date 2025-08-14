'use client';

import React, { useState } from 'react';
import { ClaimDto } from '@/types/api.types';
import { ClaimCockpit } from './ClaimCockpit';
import { NewClaim } from './NewClaim';
import { EditClaim } from './EditClaim';
import { ViewClaim } from './ViewClaim';

type ClaimView = 'cockpit' | 'new' | 'edit' | 'view';

interface ClaimState {
  view: ClaimView;
  selectedClaimId?: string;
}

interface ClaimsProps {
  onBack?: () => void;
}

export const Claims: React.FC<ClaimsProps> = ({ onBack }) => {
  const [state, setState] = useState<ClaimState>({
    view: 'cockpit'
  });

  const handleShowCockpit = () => {
    setState({ view: 'cockpit' });
  };

  const handleShowNew = () => {
    setState({ view: 'new' });
  };

  const handleShowEdit = (claim: ClaimDto) => {
    setState({ 
      view: 'edit', 
      selectedClaimId: claim.id 
    });
  };

  const handleShowView = (claim: ClaimDto) => {
    setState({ 
      view: 'view', 
      selectedClaimId: claim.id 
    });
  };

  const handleClaimCreated = () => {
    // Refresh the cockpit view
    setState({ view: 'cockpit' });
  };

  const handleClaimUpdated = () => {
    // Go back to cockpit view
    setState({ view: 'cockpit' });
  };

  // Update ClaimCockpit handlers to use the navigation functions
  const enhancedClaimCockpit = () => (
    <ClaimCockpit 
      onBack={onBack}
      onAddNew={handleShowNew}
      onEdit={handleShowEdit}
      onView={handleShowView}
    />
  );

  const renderCurrentView = () => {
    switch (state.view) {
      case 'new':
        return (
          <NewClaim
            onClaimCreated={handleClaimCreated}
            onBack={handleShowCockpit}
          />
        );
      case 'edit':
        if (!state.selectedClaimId) {
          setState({ view: 'cockpit' });
          return null;
        }
        return (
          <EditClaim
            claimId={state.selectedClaimId}
            onClaimUpdated={handleClaimUpdated}
            onCancel={handleShowCockpit}
            onBack={handleShowCockpit}
          />
        );
      case 'view':
        if (!state.selectedClaimId) {
          setState({ view: 'cockpit' });
          return null;
        }
        return (
          <ViewClaim
            claimId={state.selectedClaimId}
            onCancel={handleShowCockpit}
            onBack={handleShowCockpit}
          />
        );
      case 'cockpit':
      default:
        return enhancedClaimCockpit();
    }
  };

  return (
    <div className="h-full w-full">
      {renderCurrentView()}
    </div>
  );
};

export default Claims;
