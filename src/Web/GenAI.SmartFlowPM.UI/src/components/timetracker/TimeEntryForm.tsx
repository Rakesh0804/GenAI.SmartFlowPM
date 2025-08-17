'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Save, X, Trash2 } from 'lucide-react';
import { timeTrackerService } from '../../services/timetracker.service';
import { projectService } from '../../services/project.service';
import { 
  CreateTimeEntryDto, 
  UpdateTimeEntryDto, 
  TimeEntryDto, 
  TimeCategoryDto
} from '../../interfaces/timetracker.interfaces';
import { ProjectDto } from '../../interfaces/project.interfaces';
import { TimeEntryType, BillableStatus } from '../../interfaces/enums.interfaces';
import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CustomSelect from '@/components/common/CustomSelect';

interface TimeEntryFormProps {
  entryId?: string;
  isEdit?: boolean;
  userId: string;
  onSave?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isModal?: boolean;
  initialData?: Partial<CreateTimeEntryDto>;
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  entryId,
  isEdit = false,
  userId,
  onSave,
  onCancel,
  onDelete,
  isModal = false,
  initialData
}) => {
  const [formData, setFormData] = useState<CreateTimeEntryDto>({
    timeCategoryId: '',
    startTime: new Date(),
    duration: 0,
    entryType: TimeEntryType.Regular,
    billableStatus: BillableStatus.Billable,
    isManualEntry: true,
    description: '',
    ...initialData
  });

  const [existingEntry, setExistingEntry] = useState<TimeEntryDto | null>(null);
  const [timeCategories, setTimeCategories] = useState<TimeCategoryDto[]>([]);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Time calculation helpers
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const { success, error } = useToast();

  useEffect(() => {
    loadInitialData();
  }, [entryId]);

  useEffect(() => {
    // Calculate duration when start/end times change
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}`);
      const end = new Date(`1970-01-01T${endTime}`);
      if (end > start) {
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        setFormData(prev => ({ ...prev, duration: diffMins }));
        setHours(Math.floor(diffMins / 60));
        setMinutes(diffMins % 60);
      }
    }
  }, [startTime, endTime]);

  useEffect(() => {
    // Calculate duration when hours/minutes change
    const totalMinutes = (hours * 60) + minutes;
    setFormData(prev => ({ ...prev, duration: totalMinutes }));
  }, [hours, minutes]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load time categories and projects in parallel
      const [categoriesData, projectsData] = await Promise.all([
        timeTrackerService.getTimeCategories(),
        projectService.getProjects()
      ]);

      setTimeCategories(categoriesData);
      setProjects(projectsData);

      // Load existing entry if editing
      if (isEdit && entryId) {
        const entry = await timeTrackerService.getTimeEntryById(entryId);
        setExistingEntry(entry);
        setFormData({
          timeCategoryId: entry.timeCategoryId,
          projectId: entry.projectId,
          taskId: entry.taskId,
          startTime: new Date(entry.startTime),
          endTime: entry.endTime ? new Date(entry.endTime) : undefined,
          duration: entry.duration,
          description: entry.description || '',
          entryType: entry.entryType,
          billableStatus: entry.billableStatus,
          hourlyRate: entry.hourlyRate,
          isManualEntry: entry.isManualEntry
        });

        // Set time display values
        const start = new Date(entry.startTime);
        setStartTime(start.toTimeString().slice(0, 5));
        if (entry.endTime) {
          const end = new Date(entry.endTime);
          setEndTime(end.toTimeString().slice(0, 5));
        }
        setHours(Math.floor(entry.duration / 60));
        setMinutes(entry.duration % 60);
      }
    } catch (err) {
      error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.timeCategoryId) {
      error('Please select a time category');
      return;
    }

    if (!formData.duration || formData.duration <= 0) {
      error('Duration must be greater than 0');
      return;
    }

    try {
      setSaving(true);
      
      if (isEdit && entryId) {
        const updateData: UpdateTimeEntryDto = {
          timeCategoryId: formData.timeCategoryId,
          projectId: formData.projectId,
          taskId: formData.taskId,
          startTime: formData.startTime,
          endTime: formData.endTime,
          duration: formData.duration,
          description: formData.description,
          entryType: formData.entryType,
          billableStatus: formData.billableStatus,
          hourlyRate: formData.hourlyRate
        };
        await timeTrackerService.updateTimeEntry(entryId, updateData);
        success('Time entry updated successfully');
      } else {
        await timeTrackerService.createTimeEntry(formData);
        success('Time entry created successfully');
      }

      onSave?.();
    } catch (err) {
      error(isEdit ? 'Failed to update time entry' : 'Failed to create time entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entryId || !isEdit) return;

    if (!confirm('Are you sure you want to delete this time entry?')) {
      return;
    }

    try {
      setDeleting(true);
      await timeTrackerService.deleteTimeEntry(entryId);
      success('Time entry deleted successfully');
      onDelete?.();
    } catch (err) {
      error('Failed to delete time entry');
    } finally {
      setDeleting(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Time Category *
          </label>
          <CustomSelect
            value={formData.timeCategoryId}
            onChange={(value) => setFormData(prev => ({ ...prev, timeCategoryId: value }))}
            options={[
              { value: '', label: 'Select Category' },
              ...timeCategories.map(category => ({
                value: category.id,
                label: category.name
              }))
            ]}
            placeholder="Select Category"
            className="w-full"
          />
        </div>

        {/* Project */}
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <CustomSelect
            value={formData.projectId || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, projectId: value || undefined }))}
            options={[
              { value: '', label: 'No Project' },
              ...projects.map(project => ({
                value: project.id,
                label: project.name
              }))
            ]}
            placeholder="No Project"
            className="w-full"
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            id="date"
            value={formData.startTime.toISOString().split('T')[0]}
            onChange={(e) => {
              const date = new Date(e.target.value);
              setFormData(prev => ({ ...prev, startTime: date }));
            }}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Entry Type */}
        <div>
          <label htmlFor="entryType" className="block text-sm font-medium text-gray-700 mb-2">
            Entry Type
          </label>
          <CustomSelect
            value={(formData.entryType ?? TimeEntryType.Regular).toString()}
            onChange={(value) => setFormData(prev => ({ ...prev, entryType: parseInt(value) as TimeEntryType }))}
            options={[
              { value: TimeEntryType.Regular.toString(), label: 'Regular' },
              { value: TimeEntryType.Overtime.toString(), label: 'Overtime' },
              { value: TimeEntryType.Break.toString(), label: 'Break' },
              { value: TimeEntryType.Meeting.toString(), label: 'Meeting' }
            ]}
            className="w-full"
          />
        </div>
      </div>

      {/* Time Input Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Time Duration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start/End Time Method */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Start & End Time</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="startTime" className="block text-xs font-medium text-gray-600 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-xs font-medium text-gray-600 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Duration Method */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Direct Duration</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="hours" className="block text-xs font-medium text-gray-600 mb-1">
                  Hours
                </label>
                <input
                  type="number"
                  id="hours"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="minutes" className="block text-xs font-medium text-gray-600 mb-1">
                  Minutes
                </label>
                <input
                  type="number"
                  id="minutes"
                  min="0"
                  max="59"
                  step="15"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total Duration Display */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-600">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Total Duration: {formatDuration(formData.duration || 0)}</span>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="billableStatus" className="block text-sm font-medium text-gray-700 mb-2">
            Billable Status
          </label>
          <CustomSelect
            value={(formData.billableStatus ?? BillableStatus.Billable).toString()}
            onChange={(value) => setFormData(prev => ({ ...prev, billableStatus: parseInt(value) as BillableStatus }))}
            options={[
              { value: BillableStatus.Billable.toString(), label: 'Billable' },
              { value: BillableStatus.NonBillable.toString(), label: 'Non-Billable' },
              { value: BillableStatus.Internal.toString(), label: 'Internal' }
            ]}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate
          </label>
          <input
            type="number"
            id="hourlyRate"
            step="0.01"
            min="0"
            value={formData.hourlyRate || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || undefined }))}
            placeholder="0.00"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          placeholder="Describe what you worked on..."
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div>
          {isEdit && entryId && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {isModal && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              <X className="h-4 w-4 mr-2 inline" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : (isEdit ? 'Update' : 'Save')}
          </button>
        </div>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Edit Time Entry' : 'Add Time Entry'}
          </h2>
        </div>
        {formContent}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Time Entry' : 'Add Time Entry'}
        </h2>
        <p className="text-gray-600">
          {isEdit ? 'Update your time entry details' : 'Record time spent on work activities'}
        </p>
      </div>
      {formContent}
    </div>
  );
};

export default TimeEntryForm;
