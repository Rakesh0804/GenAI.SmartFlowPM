'use client';

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { TimeTrackerPage } from '../../components/timetracker';
import { AppLayout } from '../../components/layout/AppLayout';

export default function TimeTrackerPageRoute() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the time tracker.</p>
          <a 
            href="/login" 
            className="mt-4 inline-block bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-primaryDark transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Check if user has manager role for manager view
  const isManagerView = user.roles?.some((role: string) => 
    role.toLowerCase().includes('manager') || 
    role.toLowerCase().includes('admin') ||
    role.toLowerCase().includes('supervisor')
  ) || false;

  return (
    <AppLayout>
      <TimeTrackerPage 
        userId={user.id} 
        isManagerView={isManagerView}
      />
    </AppLayout>
  );
}
