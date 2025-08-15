'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FolderOpen, 
  CheckSquare, 
  Plus, 
  BarChart3, 
  Users, 
  Calendar,
  ArrowRight 
} from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();

  const handleNavigateToTasks = () => {
    router.push('/projects/tasks');
  };

  const handleCreateProject = () => {
    // This would navigate to project creation form when implemented
    console.log('Create project functionality coming soon');
  };

  const handleCreateTask = () => {
    router.push('/projects/tasks?action=create');
  };

  const projectStats = [
    { label: 'Total Projects', value: 8, icon: FolderOpen, color: 'blue' },
    { label: 'Active Tasks', value: 34, icon: CheckSquare, color: 'green' },
    { label: 'Team Members', value: 12, icon: Users, color: 'purple' },
    { label: 'This Month', value: 5, icon: Calendar, color: 'orange' }
  ];

  const quickActions = [
    {
      title: 'Manage Tasks',
      description: 'View, create, and manage all project tasks',
      icon: CheckSquare,
      color: 'blue',
      action: handleNavigateToTasks
    },
    {
      title: 'Create Project',
      description: 'Start a new project with team members',
      icon: Plus,
      color: 'green',
      action: handleCreateProject
    },
    {
      title: 'Create Task',
      description: 'Add a new task to existing projects',
      icon: Plus,
      color: 'purple',
      action: handleCreateTask
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600">Manage your projects and tasks efficiently</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {projectStats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colorClasses = {
                blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
                green: 'bg-green-50 border-green-200 hover:bg-green-100',
                purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
              };

              const iconClasses = {
                blue: 'text-blue-600',
                green: 'text-green-600',
                purple: 'text-purple-600'
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

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">More Features Coming Soon</h3>
            <p className="text-gray-600 mb-4">
              Project creation, team management, and advanced analytics are under development.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>• Project Templates</span>
              <span>• Team Collaboration</span>
              <span>• Advanced Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
