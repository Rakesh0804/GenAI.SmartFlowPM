'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  Calendar, 
  Users, 
  TrendingUp, 
  Filter, 
  Download,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
import { timeTrackerService } from '../../services/timetracker.service';
import { 
  TimeReportDto, 
  TeamTimeReportDto, 
  ProjectTimeSummaryDto,
  UserTimeReportDto
} from '../../interfaces/timetracker.interfaces';
import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TimeReportsProps {
  userId?: string;
  isManagerView?: boolean;
}

export const TimeReports: React.FC<TimeReportsProps> = ({ 
  userId, 
  isManagerView = false 
}) => {
  const [timeReports, setTimeReports] = useState<TimeReportDto[]>([]);
  const [teamReports, setTeamReports] = useState<TeamTimeReportDto[]>([]);
  const [projectSummaries, setProjectSummaries] = useState<ProjectTimeSummaryDto[]>([]);
  const [userSummaries, setUserSummaries] = useState<UserTimeReportDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const { success, error } = useToast();

  useEffect(() => {
    loadReports();
  }, [userId, dateRange]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      const promises = [];
      
      // Load user time reports
      if (userId) {
        promises.push(timeTrackerService.getUserTimeReport(userId, dateRange.startDate, dateRange.endDate));
      }
      
      // Load team reports if manager view
      if (isManagerView) {
        promises.push(timeTrackerService.getTeamTimeReport(dateRange.startDate, dateRange.endDate));
      }

      const results = await Promise.all(promises);
      
      if (userId) {
        setTimeReports([results[0] as TimeReportDto]);
      }
      
      if (isManagerView) {
        const offset = userId ? 1 : 0;
        const teamReport = results[offset] as TeamTimeReportDto;
        setTeamReports([teamReport]);
        setProjectSummaries(teamReport?.projectSummary || []);
        setUserSummaries(teamReport?.teamMembers || []);
      }
      
    } catch (err) {
      error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotalHours = (reports: TimeReportDto[]) => {
    return reports.reduce((total, report) => total + report.totalHours, 0);
  };

  const calculateBillableHours = (reports: TimeReportDto[]) => {
    return reports.reduce((total, report) => total + report.billableHours, 0);
  };

  const calculateRevenue = (reports: TimeReportDto[]) => {
    // Calculate estimated revenue based on billable hours
    // This is a placeholder calculation - actual rate would come from user settings
    const averageRate = 50; // $50 per hour placeholder
    return calculateBillableHours(reports) * averageRate;
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
          <h2 className="text-2xl font-bold tracking-tight text-secondary-500">
            {isManagerView ? 'Team Time Reports' : 'My Time Reports'}
          </h2>
          <p className="text-gray-600">
            Analytics and insights for time tracking
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primaryDark">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={loadReports}
              className="w-full bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-primaryDark focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'productivity', label: 'Productivity', icon: TrendingUp },
              { id: 'projects', label: 'Projects', icon: FileText },
              ...(isManagerView ? [{ id: 'team', label: 'Team', icon: Users }] : [])
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Total Hours</p>
                      <p className="text-2xl font-bold text-orange-800">
                        {formatDuration(calculateTotalHours(timeReports) * 60)}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Billable Hours</p>
                      <p className="text-2xl font-bold text-green-800">
                        {formatDuration(calculateBillableHours(timeReports) * 60)}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Projects</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {projectSummaries.length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Revenue</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {formatCurrency(calculateRevenue(timeReports))}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Recent Time Entries Chart Placeholder */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Time Distribution</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-4" />
                    <p>Chart visualization would be implemented here</p>
                    <p className="text-sm">(Integration with Chart.js or similar)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Productivity Tab */}
          {activeTab === 'productivity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Productivity */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Average</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Hours per Day</span>
                      <span className="font-semibold">
                        {timeReports.length > 0 ? 
                          formatDuration((calculateTotalHours(timeReports) / timeReports.length) * 60) : 
                          '0h 0m'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Billable Ratio</span>
                      <span className="font-semibold text-green-600">
                        {timeReports.length > 0 ? 
                          `${Math.round((calculateBillableHours(timeReports) / calculateTotalHours(timeReports)) * 100)}%` : 
                          '0%'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weekly Trends */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Trends</h3>
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Weekly trend chart</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Project Time Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Billable Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projectSummaries.map((project) => (
                      <tr key={project.projectId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{project.projectName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDuration(project.totalHours * 60)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDuration(project.billableHours * 60)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(project.billableHours * 50)} {/* Estimated at $50/hr */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {projectSummaries.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No project data available for the selected period
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Team Tab (Manager View Only) */}
          {activeTab === 'team' && isManagerView && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Team Performance</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Members */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Team Members</h4>
                  <div className="space-y-3">
                    {userSummaries.map((user) => (
                      <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{user.userName}</div>
                          <div className="text-sm text-gray-500">
                            {formatDuration(user.totalHours * 60)} total
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {formatDuration(user.billableHours * 60)} billable
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.totalHours > 0 ? 
                              `${Math.round((user.billableHours / user.totalHours) * 100)}% ratio` : 
                              '0% ratio'
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Utilization */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Team Utilization</h4>
                  <div className="h-48 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto mb-4" />
                      <p>Team utilization chart</p>
                      <p className="text-sm">(Shows capacity vs actual hours)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeReports;
