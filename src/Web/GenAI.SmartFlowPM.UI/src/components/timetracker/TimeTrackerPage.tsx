'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  BarChart3, 
  FileText, 
  Settings,
  Plus,
  List
} from 'lucide-react';
import TimeTrackerDashboard from './TimeTrackerDashboard';
import TimesheetCockpit from './TimesheetCockpit';
import TimeEntryForm from './TimeEntryForm';
import TimeReports from './TimeReports';
import TimeCalendar from './TimeCalendar';
import { TimeEntryDto, CreateTimeEntryDto } from '../../interfaces/timetracker.interfaces';

interface TimeTrackerPageProps {
  userId: string;
  isManagerView?: boolean;
}

export const TimeTrackerPage: React.FC<TimeTrackerPageProps> = ({ 
  userId, 
  isManagerView = false 
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntryDto | null>(null);
  const [entryFormInitialData, setEntryFormInitialData] = useState<Partial<CreateTimeEntryDto> | undefined>();

  const handleEditEntry = (entry: TimeEntryDto) => {
    setEditingEntry(entry);
    setShowEntryForm(true);
  };

  const handleCreateEntry = (date?: Date) => {
    setEditingEntry(null);
    setEntryFormInitialData(date ? { startTime: date } : undefined);
    setShowEntryForm(true);
  };

  const handleEntryFormClose = () => {
    setShowEntryForm(false);
    setEditingEntry(null);
    setEntryFormInitialData(undefined);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Clock, description: 'Main time tracking dashboard' },
    { id: 'timesheets', label: 'Timesheets', icon: FileText, description: 'Manage and approve timesheets' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, description: 'Calendar view of time entries' },
    { id: 'reports', label: 'Reports', icon: BarChart3, description: 'Time tracking analytics' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TimeTrackerDashboard userId={userId} />;
      case 'timesheets':
        return <TimesheetCockpit userId={userId} isManagerView={isManagerView} />;
      case 'calendar':
        return (
          <TimeCalendar 
            userId={userId} 
            onEditEntry={handleEditEntry}
            onCreateEntry={handleCreateEntry}
          />
        );
      case 'reports':
        return <TimeReports userId={userId} isManagerView={isManagerView} />;
      default:
        return <TimeTrackerDashboard userId={userId} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
            <Clock className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-600">Time Tracker</h1>
            <p className="text-sm text-gray-600">Manage your time effectively</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleCreateEntry()}
            className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primaryDark transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <nav className="flex space-x-1 p-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title={tab.description}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {renderTabContent()}
      </div>

      {/* Entry Form Modal */}
      {showEntryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <TimeEntryForm
              entryId={editingEntry?.id}
              isEdit={!!editingEntry}
              userId={userId}
              onSave={handleEntryFormClose}
              onCancel={handleEntryFormClose}
              onDelete={handleEntryFormClose}
              isModal={true}
              initialData={entryFormInitialData}
            />
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 bg-white p-2 rounded shadow-sm border">
        <div>Shortcuts: T (Timer), A (Add Entry), Tab (Next Tab)</div>
      </div>
    </div>
  );
};

export default TimeTrackerPage;
