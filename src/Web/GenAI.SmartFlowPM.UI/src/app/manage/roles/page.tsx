'use client';

import React, { useState } from 'react';
import { RoleDto } from '@/types/api.types';
import { RoleCockpit } from '@/components/roles/RoleCockpit';
import { NewRole } from '@/components/roles/NewRole';
import { EditRole } from '@/components/roles/EditRole';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

interface RolePageState {
  mode: ViewMode;
  selectedRole?: RoleDto;
}

export default function RolesPage() {
  const [pageState, setPageState] = useState<RolePageState>({ mode: 'list' });

  const handleNewRole = () => {
    setPageState({ mode: 'create' });
  };

  const handleEditRole = (role: RoleDto) => {
    setPageState({ mode: 'edit', selectedRole: role });
  };

  const handleViewRole = (role: RoleDto) => {
    setPageState({ mode: 'view', selectedRole: role });
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
        <NewRole
          onBack={handleBackToList}
          onRoleCreated={handleSuccess}
        />
      );

    case 'edit':
      return pageState.selectedRole?.id ? (
        <EditRole
          roleId={pageState.selectedRole.id}
          readOnly={false}
          onBack={handleBackToList}
          onRoleUpdated={handleSuccess}
        />
      ) : null;

    case 'view':
      return pageState.selectedRole?.id ? (
        <EditRole
          roleId={pageState.selectedRole.id}
          readOnly={true}
          onBack={handleBackToList}
          onRoleUpdated={handleSuccess}
        />
      ) : null;

    case 'list':
    default:
      return (
        <RoleCockpit
          onNewRole={handleNewRole}
          onEditRole={handleEditRole}
          onViewRole={handleViewRole}
          onBackClick={() => {
            // Navigate back to manage or dashboard
            window.history.back();
          }}
        />
      );
  }
}
