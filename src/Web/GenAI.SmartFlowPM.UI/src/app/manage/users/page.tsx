'use client';

import React, { useState } from 'react';
import { UserCockpit, NewUser, EditUser } from '@/components/users';
import { UserDto } from '@/types/api.types';

type ViewMode = 'cockpit' | 'new' | 'edit' | 'view';

export default function ManageUsersPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('cockpit');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleNewUser = () => {
    setCurrentView('new');
  };

  const handleEditUser = (user: UserDto) => {
    setSelectedUserId(user.id);
    setCurrentView('edit');
  };

  const handleViewUser = (user: UserDto) => {
    setSelectedUserId(user.id);
    setCurrentView('view');
  };

  const handleBackToCockpit = () => {
    setCurrentView('cockpit');
    setSelectedUserId(null);
  };

  const handleUserCreated = () => {
    // After creating, go back to cockpit
    handleBackToCockpit();
  };

  const handleUserUpdated = () => {
    // After updating, go back to cockpit
    handleBackToCockpit();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'new':
        return (
          <NewUser
            onUserCreated={handleUserCreated}
            onCancel={handleBackToCockpit}
            onBack={handleBackToCockpit}
          />
        );
      
      case 'edit':
        return selectedUserId ? (
          <EditUser
            userId={selectedUserId}
            onUserUpdated={handleUserUpdated}
            onCancel={handleBackToCockpit}
            onBack={handleBackToCockpit}
          />
        ) : null;

      case 'view':
        return selectedUserId ? (
          <EditUser
            userId={selectedUserId}
            onUserUpdated={handleUserUpdated}
            onCancel={handleBackToCockpit}
            onBack={handleBackToCockpit}
            readOnly={true}
          />
        ) : null;
      
      case 'cockpit':
      default:
        return (
          <UserCockpit
            onNewUser={handleNewUser}
            onEditUser={handleEditUser}
            onViewUser={handleViewUser}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
}
