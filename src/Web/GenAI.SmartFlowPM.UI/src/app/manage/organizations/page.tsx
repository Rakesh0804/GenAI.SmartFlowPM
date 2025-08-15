'use client';

import React, { useState } from 'react';
import { OrganizationDto } from '@/types/api.types';
import { OrganizationCockpit } from '@/components/organizations/OrganizationCockpit';
import { NewOrganization } from '@/components/organizations/NewOrganization';
import { EditOrganization } from '@/components/organizations/EditOrganization';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

interface OrganizationPageState {
  mode: ViewMode;
  selectedOrganization?: OrganizationDto;
}

export default function OrganizationsPage() {
  const [pageState, setPageState] = useState<OrganizationPageState>({ mode: 'list' });

  const handleNewOrganization = () => {
    setPageState({ mode: 'create' });
  };

  const handleEditOrganization = (organization: OrganizationDto) => {
    setPageState({ mode: 'edit', selectedOrganization: organization });
  };

  const handleViewOrganization = (organization: OrganizationDto) => {
    setPageState({ mode: 'view', selectedOrganization: organization });
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
        <NewOrganization
          onBack={handleBackToList}
          onOrganizationCreated={handleSuccess}
        />
      );

    case 'edit':
      return pageState.selectedOrganization?.id ? (
        <EditOrganization
          organizationId={pageState.selectedOrganization.id}
          readOnly={false}
          onBack={handleBackToList}
          onOrganizationUpdated={handleSuccess}
        />
      ) : null;

    case 'view':
      return pageState.selectedOrganization?.id ? (
        <EditOrganization
          organizationId={pageState.selectedOrganization.id}
          readOnly={true}
          onBack={handleBackToList}
          onOrganizationUpdated={handleSuccess}
        />
      ) : null;

    case 'list':
    default:
      return (
        <OrganizationCockpit
          onNewOrganization={handleNewOrganization}
          onEditOrganization={handleEditOrganization}
          onViewOrganization={handleViewOrganization}
          onBackClick={() => {
            // Navigate back to manage or dashboard
            window.history.back();
          }}
        />
      );
  }
}
