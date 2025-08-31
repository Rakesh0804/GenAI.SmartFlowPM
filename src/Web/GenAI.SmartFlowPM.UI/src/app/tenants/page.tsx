'use client';

import React, { useState } from 'react';
import { TenantCockpit } from '../../components/tenants/TenantCockpit';
import { TenantFormNew } from '../../components/tenants/TenantFormNew';
import { TenantDto } from '../../interfaces/tenant.interfaces';

type ViewMode = 'cockpit' | 'create' | 'edit' | 'view';

export default function TenantManagementPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('cockpit');
  const [selectedTenant, setSelectedTenant] = useState<TenantDto | undefined>(undefined);

  const handleBackToCockpit = () => {
    setCurrentView('cockpit');
    setSelectedTenant(undefined);
  };

  const handleNewTenant = () => {
    setSelectedTenant(undefined);
    setCurrentView('create');
  };

  const handleViewTenant = (tenant: TenantDto) => {
    setSelectedTenant(tenant);
    setCurrentView('view');
  };

  const handleEditTenant = (tenant: TenantDto) => {
    setSelectedTenant(tenant);
    setCurrentView('edit');
  };

  const handleSaveTenant = (tenant: TenantDto) => {
    // Handle successful save
    console.log('Tenant saved:', tenant);
    setCurrentView('cockpit');
    setSelectedTenant(undefined);
  };

  const handleCancelForm = () => {
    setCurrentView('cockpit');
    setSelectedTenant(undefined);
  };

  const handleBackToDashboard = () => {
    // For now, just go back to cockpit
    // In a real implementation, this would navigate to the main dashboard
    window.history.back();
  };

  return (
    <div className="h-screen bg-gray-50">
      {currentView === 'cockpit' && (
        <TenantCockpit
          onBackClick={handleBackToDashboard}
          onNewTenant={handleNewTenant}
          onViewTenant={handleViewTenant}
          onEditTenant={handleEditTenant}
        />
      )}

      {(currentView === 'create' || currentView === 'edit' || currentView === 'view') && (
        <TenantFormNew
          tenant={selectedTenant}
          mode={currentView}
          onSave={handleSaveTenant}
          onCancel={handleCancelForm}
          onBack={handleBackToCockpit}
        />
      )}
    </div>
  );
}
