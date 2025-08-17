'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TeamDto } from '@/types/api.types';
import TeamCockpit from '@/components/teams/TeamCockpit';
import TeamFormNew from '@/components/teams/TeamFormNew';
import { 
  Users, 
  UserPlus, 
  Plus, 
  BarChart3, 
  Calendar,
  Crown,
  ArrowRight 
} from 'lucide-react';

type ViewMode = 'dashboard' | 'cockpit' | 'create' | 'edit' | 'view';

interface TeamViewState {
  mode: ViewMode;
  selectedTeam?: TeamDto;
}

export default function TeamsPage() {
  const router = useRouter();
  const [viewState, setViewState] = useState<TeamViewState>({ mode: 'dashboard' });

  const handleNavigateToCockpit = () => {
    setViewState({ mode: 'cockpit' });
  };

  const handleCreateTeam = () => {
    setViewState({ mode: 'create' });
  };

  const handleEditTeam = (team: TeamDto) => {
    setViewState({ mode: 'edit', selectedTeam: team });
  };

  const handleViewTeam = (team: TeamDto) => {
    setViewState({ mode: 'view', selectedTeam: team });
  };

  const handleBackToDashboard = () => {
    setViewState({ mode: 'dashboard' });
  };

  const handleBackToCockpit = () => {
    setViewState({ mode: 'cockpit' });
  };

  const handleTeamSaved = (team: TeamDto) => {
    console.log('Team saved:', team);
    setViewState({ mode: 'cockpit' });
  };

  const handleTeamFormCancel = () => {
    setViewState({ mode: 'cockpit' });
  };

  const handleEditFromView = () => {
    if (viewState.selectedTeam) {
      setViewState({ mode: 'edit', selectedTeam: viewState.selectedTeam });
    }
  };

  // Render based on current view mode
  if (viewState.mode === 'cockpit') {
    return (
      <TeamCockpit
        onNewTeam={handleCreateTeam}
        onEditTeam={handleEditTeam}
        onViewTeam={handleViewTeam}
        onBackClick={handleBackToDashboard}
      />
    );
  }

  if (viewState.mode === 'create') {
    return (
      <TeamFormNew
        mode="create"
        onSave={handleTeamSaved}
        onCancel={handleTeamFormCancel}
        onBack={handleBackToCockpit}
      />
    );
  }

  if (viewState.mode === 'edit') {
    return (
      <TeamFormNew
        team={viewState.selectedTeam}
        mode="edit"
        onSave={handleTeamSaved}
        onCancel={handleTeamFormCancel}
        onBack={handleBackToCockpit}
      />
    );
  }

  if (viewState.mode === 'view') {
    return (
      <TeamFormNew
        team={viewState.selectedTeam}
        mode="view"
        onEdit={handleEditFromView}
        onBack={handleBackToCockpit}
      />
    );
  }

  // Dashboard view (default)
  const teamStats = [
    { label: 'Total Teams', value: 6, icon: Users, color: 'blue' },
    { label: 'Team Members', value: 28, icon: UserPlus, color: 'green' },
    { label: 'Team Leaders', value: 6, icon: Crown, color: 'purple' },
    { label: 'Active Projects', value: 12, icon: Calendar, color: 'orange' }
  ];

  const quickActions = [
    {
      title: 'Team Cockpit',
      description: 'View, create, and manage all teams',
      icon: Users,
      color: 'blue',
      action: handleNavigateToCockpit
    },
    {
      title: 'Create Team',
      description: 'Start a new team with members and leader',
      icon: Plus,
      color: 'green',
      action: handleCreateTeam
    },
    {
      title: 'Add Members',
      description: 'Invite new members to existing teams',
      icon: UserPlus,
      color: 'purple',
      action: () => router.push('/user-management')
    },
    {
      title: 'Team Analytics',
      description: 'View team performance and statistics',
      icon: BarChart3,
      color: 'orange',
      action: () => router.push('/teams/analytics')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
              <p className="text-gray-600">Manage your teams and collaborate effectively</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {teamStats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-primary-100 text-primary-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-orange-100 text-accent',
              orange: 'bg-orange-100 text-orange-600'
            };

            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colorClasses = {
                blue: 'bg-primary-50 border-primary-200 hover:bg-primary-100',
                green: 'bg-green-50 border-green-200 hover:bg-green-100',
                purple: 'bg-purple-50 border-purple-200 hover:bg-orange-100',
                orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
              };

              const iconClasses = {
                blue: 'text-primary-600',
                green: 'text-green-600',
                purple: 'text-accent',
                orange: 'text-orange-600'
              };

              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${colorClasses[action.color as keyof typeof colorClasses]}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${iconClasses[action.color as keyof typeof iconClasses]}`} />
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Teams */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Teams</h2>
            <button
              onClick={handleNavigateToCockpit}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View All Teams
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for recent teams - you can implement this with real data */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Development Team</h3>
                  <p className="text-sm text-gray-500">5 members</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Building core platform features</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Design Team</h3>
                  <p className="text-sm text-gray-500">3 members</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Creating user experiences</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Marketing Team</h3>
                  <p className="text-sm text-gray-500">4 members</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Growing user engagement</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">More Team Features Coming Soon</h3>
            <p className="text-gray-600 mb-4">
              Advanced team analytics, performance tracking, and collaboration tools are under development.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>• Team Analytics</span>
              <span>• Performance Metrics</span>
              <span>• Team Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
