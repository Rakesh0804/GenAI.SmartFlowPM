import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, FileText, Download, Send } from 'lucide-react';
import { timeTrackerService } from '../../services/timetracker.service';
import { 
  TimesheetDto, 
  TimeEntryDto
} from '../../interfaces/timetracker.interfaces';
import { TimesheetStatus } from '../../interfaces/enums.interfaces';
import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CustomSelect from '@/components/common/CustomSelect';

interface TimesheetCockpitProps {
  userId?: string;
  isManagerView?: boolean;
}

export const TimesheetCockpit: React.FC<TimesheetCockpitProps> = ({ 
  userId, 
  isManagerView = false 
}) => {
  const [timesheets, setTimesheets] = useState<TimesheetDto[]>([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetDto | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { success, error } = useToast();

  useEffect(() => {
    loadTimesheets();
  }, [userId, filterStatus]);

  const loadTimesheets = async () => {
    try {
      setLoading(true);
      const data = await timeTrackerService.getTimesheets();
      // Ensure data is an array before setting state
      setTimesheets(Array.isArray(data) ? data : []);
    } catch (err) {
      error('Failed to load timesheets');
      setTimesheets([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadTimesheetEntries = async (timesheetId: string) => {
    try {
      // Use the dedicated endpoint for getting time entries by timesheet ID
      const entries = await timeTrackerService.getTimeEntriesByTimesheetId(timesheetId);
      // Ensure entries is an array
      setTimeEntries(Array.isArray(entries) ? entries : []);
    } catch (err) {
      error('Failed to load timesheet entries');
      setTimeEntries([]); // Set empty array on error
    }
  };

  const handleTimesheetSelect = (timesheet: TimesheetDto) => {
    setSelectedTimesheet(timesheet);
    loadTimesheetEntries(timesheet.id);
  };

  const handleSubmitTimesheet = async (timesheetId: string) => {
    try {
      setSubmitting(true);
      await timeTrackerService.submitTimesheet(timesheetId, {});
      success('Timesheet submitted for approval');
      loadTimesheets();
    } catch (err) {
      error('Failed to submit timesheet');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveTimesheet = async (timesheetId: string) => {
    try {
      setSubmitting(true);
      await timeTrackerService.approveTimesheet(timesheetId, { approvalNotes });
      success('Timesheet approved successfully');
      setApprovalNotes('');
      loadTimesheets();
    } catch (err) {
      error('Failed to approve timesheet');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectTimesheet = async (timesheetId: string) => {
    try {
      setSubmitting(true);
      await timeTrackerService.rejectTimesheet(timesheetId, { approvalNotes });
      success('Timesheet rejected');
      setApprovalNotes('');
      loadTimesheets();
    } catch (err) {
      error('Failed to reject timesheet');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: TimesheetStatus) => {
    const statusClasses = {
      [TimesheetStatus.Draft]: 'bg-gray-100 text-gray-800',
      [TimesheetStatus.Submitted]: 'bg-blue-100 text-blue-800',
      [TimesheetStatus.Approved]: 'bg-green-100 text-green-800',
      [TimesheetStatus.Rejected]: 'bg-red-100 text-red-800'
    };

    const statusLabels = {
      [TimesheetStatus.Draft]: 'Draft',
      [TimesheetStatus.Submitted]: 'Submitted',
      [TimesheetStatus.Approved]: 'Approved',
      [TimesheetStatus.Rejected]: 'Rejected'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {isManagerView ? 'Team Timesheets' : 'My Timesheets'}
          </h2>
          <p className="text-gray-600">
            Manage and approve timesheet submissions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <CustomSelect
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'draft', label: 'Draft' },
                { value: 'submitted', label: 'Submitted' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }
              ]}
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={loadTimesheets}
              className="w-full bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-primaryDark focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timesheets List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timesheets
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Array.isArray(timesheets) && timesheets.length > 0 ? (
                timesheets.map((timesheet) => (
                  <div
                    key={timesheet.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTimesheet?.id === timesheet.id
                        ? 'border-brand-primary bg-orange-50'
                        : 'hover:border-brand-primary/50'
                    }`}
                    onClick={() => handleTimesheetSelect(timesheet)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">
                        {new Date(timesheet.startDate).toLocaleDateString()} - {new Date(timesheet.endDate).toLocaleDateString()}
                      </div>
                      {getStatusBadge(timesheet.status)}
                    </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>Total: {timesheet.totalHours}h</div>
                    <div>Billable: {timesheet.billableHours}h</div>
                  </div>
                  {timesheet.submittedAt && (
                    <div className="text-xs text-gray-500 mt-2">
                      Submitted: {new Date(timesheet.submittedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {loading ? 'Loading timesheets...' : 'No timesheets found'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timesheet Details */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Timesheet Details
            </h3>
          </div>
          <div className="p-6">
            {selectedTimesheet ? (
              <div className="space-y-6">
                {/* Time Entries */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Time Entries</h4>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Billable</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(timeEntries) && timeEntries.length > 0 ? (
                          timeEntries.map((entry) => (
                            <tr key={entry.id}>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {new Date(entry.startTime).toLocaleDateString()}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-900">{entry.projectName || 'General'}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{formatDuration(entry.duration)}</td>
                              <td className="px-3 py-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  entry.billableStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {entry.billableStatus === 1 ? 'Yes' : 'No'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                              No time entries found for this timesheet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>

                    {selectedTimesheet.status === TimesheetStatus.Draft && !isManagerView && (
                      <button
                        onClick={() => handleSubmitTimesheet(selectedTimesheet.id)}
                        disabled={submitting}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit
                      </button>
                    )}
                  </div>

                  {isManagerView && selectedTimesheet.status === TimesheetStatus.Submitted && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <label htmlFor="approval-notes" className="block text-sm font-medium text-gray-700 mb-2">
                          Approval Notes
                        </label>
                        <textarea
                          id="approval-notes"
                          placeholder="Add notes for approval/rejection..."
                          value={approvalNotes}
                          onChange={(e) => setApprovalNotes(e.target.value)}
                          rows={3}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveTimesheet(selectedTimesheet.id)}
                          disabled={submitting}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectTimesheet(selectedTimesheet.id)}
                          disabled={submitting}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedTimesheet.approvalNotes && (
                    <div className="pt-4 border-t">
                      <label className="text-sm font-medium text-gray-700">Approval Notes</label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900">{selectedTimesheet.approvalNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a timesheet to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetCockpit;
