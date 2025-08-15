'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TaskCockpit, TaskFormNew } from '../../../components/tasks';
import { TaskDto } from '@/types/api.types';

type ViewMode = 'cockpit' | 'create' | 'edit' | 'view';

export default function TaskManagementPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('cockpit');
  const [selectedTask, setSelectedTask] = useState<TaskDto | undefined>(undefined);
  const searchParams = useSearchParams();

  // Handle URL parameters to determine initial view
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create') {
      setCurrentView('create');
    }
  }, [searchParams]);

  const handleBackToCockpit = () => {
    setCurrentView('cockpit');
    setSelectedTask(undefined);
  };

  const handleNewTask = () => {
    setSelectedTask(undefined);
    setCurrentView('create');
  };

  const handleViewTask = (task: TaskDto) => {
    setSelectedTask(task);
    setCurrentView('view');
  };

  const handleEditTask = (task: TaskDto) => {
    setSelectedTask(task);
    setCurrentView('edit');
  };

  const handleSaveTask = (task: TaskDto) => {
    // Handle successful save
    console.log('Task saved:', task);
    setCurrentView('cockpit');
    setSelectedTask(undefined);
  };

  const handleCancelForm = () => {
    setCurrentView('cockpit');
    setSelectedTask(undefined);
  };

  const handleBackToDashboard = () => {
    // For now, just go back to cockpit
    // In a real implementation, this would navigate to the main dashboard
    window.history.back();
  };

  return (
    <>
      {currentView === 'cockpit' && (
        <TaskCockpit
          onBackClick={handleBackToDashboard}
          onNewTask={handleNewTask}
          onViewTask={handleViewTask}
          onEditTask={handleEditTask}
        />
      )}

      {(currentView === 'create' || currentView === 'edit' || currentView === 'view') && (
        <TaskFormNew
          task={selectedTask}
          mode={currentView}
          onSave={handleSaveTask}
          onCancel={handleCancelForm}
          onBack={handleBackToCockpit}
          onEdit={() => {
            if (selectedTask) {
              setCurrentView('edit');
            }
          }}
        />
      )}
    </>
  );
}
