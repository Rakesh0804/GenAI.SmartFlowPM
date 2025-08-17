'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { 
  Megaphone, 
  CalendarDays, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Users,
  FolderOpen,
  CheckSquare,
  Shield,
  Building,
  Building2,
  UserCheck,
  Clock,
  FileText,
  Loader2,
  MessageSquare,
  BarChart2,
  MapPin,
  CreditCard,
  Settings,
  Plane
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart
} from 'recharts';

// Disable static optimization for this page
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until the component is mounted on the client
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <DashboardContent />;
}

import { dashboardService } from '../../services/dashboard.service';
import { HomeDashboardDto, PendingTaskDto, RecentActivityDto, AnnouncementDto, UpcomingHolidayDto } from '../../types/api.types';

function DashboardContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<HomeDashboardDto | null>(null);
  const loadingRef = useRef(false); // Track loading state without causing re-renders
  const hasFetchedRef = useRef(false); // Track if we've already fetched data

  const loadDashboard = useCallback(async () => {
    if (loadingRef.current || hasFetchedRef.current) return; // Prevent multiple calls
    
    loadingRef.current = true;
    hasFetchedRef.current = true;
    setLoading(true);
    
    try {
      const data = await dashboardService.getHomeDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Dashboard API error:', error);
      hasFetchedRef.current = false; // Reset on error to allow retry
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []); // No dependencies to prevent re-creation

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && !dashboard && !loadingRef.current && !hasFetchedRef.current) {
      loadDashboard();
    }
  }, [isAuthenticated, dashboard, loadDashboard]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !dashboard) {
    return null;
  }

  const { 
    totalProjects, 
    activeTasks, 
    teamMembers, 
    completed, 
    overdueTasks,
    taskStatusData, 
    projectStatusData, 
    taskTypeData, 
    burndownData,
    userSummary,
    myPendingTasks,
    leaveBalance,
    recentActivities,
    upcomingHolidays,
    latestAnnouncements
  } = dashboard;
  const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

  // Navigation handlers
  const handleViewAllTasks = () => {
    // Navigate to TaskCockpit with filters for current user's pending tasks
    router.push('/projects/tasks?status=Todo&assignedTo=' + user?.id);
  };

  const handleAddProject = () => {
    // Navigate to Add Project page
    router.push('/projects/new');
  };

  const handleAddTask = () => {
    // Navigate to New Task page through the tasks management page
    router.push('/projects/tasks?action=create');
  };

  const handleCreateTeam = () => {
    // Navigate to Create Team page
    router.push('/teams/new');
  };

  const handleApplyLeave = () => {
    // Navigate to Leave Application page
    router.push('/leaves/new');
  };

  const handleCalendar = () => {
    // Navigate to Calendar page
    router.push('/calendar');
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{activeTasks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Team Members</p>
              <p className="text-3xl font-bold text-gray-900">{teamMembers}</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completed}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Overdue Tasks</p>
              <p className="text-3xl font-bold text-red-600">{overdueTasks}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* User Summary Section */}
      {userSummary && userSummary.userId && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg border border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Dashboard Summary</h3>
                <p className="text-gray-600">Welcome back, {user?.firstName} {user?.lastName}!</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-primary-600">{userSummary.myTotalTasks}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-orange-600">{userSummary.myPendingTasksCount}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-green-600">{userSummary.myCompletedTasks}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-red-600">{userSummary.myOverdueTasks}</p>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Task Status Distribution</h3>
              <p className="text-gray-500 text-sm mt-1">Overview of all task statuses</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskStatusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Task Type Distribution</h3>
              <p className="text-gray-500 text-sm mt-1">Breakdown by task types</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Project Status and Burndown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Project Status Overview</h3>
              <p className="text-gray-500 text-sm mt-1">Task status per project</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="open" stackId="a" fill="#EF4444" name="Open" />
                <Bar dataKey="inProgress" stackId="a" fill="#F59E0B" name="In Progress" />
                <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Burndown Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Sprint Burndown Chart</h3>
              <p className="text-gray-500 text-sm mt-1">Planned vs Actual progress</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={burndownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="planned" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F680" 
                  name="Planned"
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stackId="2" 
                  stroke="#EF4444" 
                  fill="#EF444480" 
                  name="Actual"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* New Row: My Leaves, Pending Tasks, Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Leaves Card with Circular Progress */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Plane className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">My Leaves</h3>
              <p className="text-gray-500 text-sm mt-1">Leave balance overview</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Compensatory Off - Circular Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                    />
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeDasharray="75, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-900">15</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Compensatory Off</p>
                  <p className="text-xs text-gray-500">Available: 15 days</p>
                </div>
              </div>
            </div>

            {/* Earned Leave - Circular Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                    />
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeDasharray="60, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-900">12</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Earned Leave</p>
                  <p className="text-xs text-gray-500">Available: 12 days</p>
                </div>
              </div>
            </div>

            {/* Leave Without Pay - Circular Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                    />
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      strokeDasharray="20, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-900">4</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Leave Without Pay</p>
                  <p className="text-xs text-gray-500">Used: 4 days</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-primary-600 text-sm hover:text-indigo-700 transition-colors">
              Apply for Leave →
            </button>
          </div>
        </div>

        {/* My Pending Tasks Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Pending Tasks</h3>
                <p className="text-gray-500 text-sm mt-1">Tasks requiring attention</p>
              </div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
              <span className="text-sm font-bold text-red-600">8</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">API Documentation Update</h4>
                <p className="text-xs text-gray-500 mt-1">Project Alpha • High Priority</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">High</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Bug Fix: Login Issues</h4>
                <p className="text-xs text-gray-500 mt-1">Project Beta • Medium Priority</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Medium</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">UI/UX Review</h4>
                <p className="text-xs text-gray-500 mt-1">Project Gamma • Low Priority</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Low</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
              onClick={handleViewAllTasks}
              className="text-orange-600 text-sm hover:text-orange-700 transition-colors"
            >
              View All Tasks →
            </button>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
              <p className="text-gray-500 text-sm mt-1">Frequently used actions</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleAddProject}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 rounded-lg transition-all duration-200 border border-primary-200"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-secondary-500">Add Project</span>
            </button>
            
            <button 
              onClick={handleAddTask}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all duration-200 border border-green-200"
            >
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-900">Add Task</span>
            </button>
            
            <button 
              onClick={handleCreateTeam}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-200 border border-blue-200"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-900">Create Team</span>
            </button>
            
            <button 
              onClick={handleCalendar}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all duration-200 border border-purple-200"
            >
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-purple-900">Calendar</span>
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-accent text-sm hover:text-purple-700 transition-colors">
              More Actions →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Cards Row: Holidays, Recent Activity, Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Holidays Card - Left */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Holidays</h3>
              <p className="text-gray-500 text-sm mt-1">Plan your projects around these dates</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm text-gray-900">Labor Day</h4>
                  <p className="text-gray-500 text-xs mt-1">Federal Holiday - Office Closed</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Sep 2</div>
                  <div className="text-xs text-gray-500">Monday</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm text-gray-900">Thanksgiving Day</h4>
                  <p className="text-gray-500 text-xs mt-1">Federal Holiday - Office Closed</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Nov 28</div>
                  <div className="text-xs text-gray-500">Thursday</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="text-emerald-600 text-sm hover:text-emerald-700 transition-colors">
              View holiday calendar →
            </button>
          </div>
        </div>

        {/* Recent Activity - Center */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-gray-500 text-sm mt-1">Latest team updates</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-medium">JD</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">John Doe</span> completed task "API Integration"
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-medium">SM</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Sarah Miller</span> created new project "Mobile App Redesign"
                  </p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-medium">MB</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Mike Brown</span> updated project timeline
                  </p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Announcements Card - Right */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Megaphone className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Latest Announcements</h3>
              <p className="text-gray-500 text-sm mt-1">Stay updated with company news</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm text-gray-900">New Project Management Guidelines</h4>
                  <p className="text-gray-500 text-xs mt-1">Updated project workflow and approval process</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">2 days ago</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm text-gray-900">Team Building Event</h4>
                  <p className="text-gray-500 text-xs mt-1">Join us for the quarterly team building activity</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">1 week ago</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="text-primary-600 text-sm hover:text-primary-700 transition-colors">
              View all announcements →
            </button>
          </div>
        </div>
      </div>

      {/* Project Modules/Features Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-gray-900">Project Features & Modules</h3>
            <p className="text-gray-500 text-sm mt-1">Comprehensive project management capabilities with multi-tenant architecture</p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* User Management Module */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-primary-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Complete
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">User Management</h4>
            <p className="text-sm text-gray-600 mb-3">Complete CRUD operations, authentication, role-based authorization with organizational hierarchy and multi-tenant support.</p>
            <div className="flex items-center text-xs text-gray-500">
              <CheckSquare className="h-3 w-3 mr-1" />
              Backend & Frontend Complete
            </div>
          </div>

          {/* Project Management Module */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Backend Only
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Project Management</h4>
            <p className="text-sm text-gray-600 mb-3">Complete project lifecycle management with CQRS pattern, comprehensive validation, and full REST API endpoints.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Frontend Implementation Pending
            </div>
          </div>

          {/* Task Management Module */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Backend Only
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Task Management</h4>
            <p className="text-sm text-gray-600 mb-3">Comprehensive task tracking with auto-generated task numbers, assignments, status updates, and dashboard analytics.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Frontend Implementation Pending
            </div>
          </div>

          {/* Organization Management Module */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Complete
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Organization Management</h4>
            <p className="text-sm text-gray-600 mb-3">Complete organizational structure with branch management, policies, holidays, and settings (Admin only).</p>
            <div className="flex items-center text-xs text-gray-500">
              <CheckSquare className="h-3 w-3 mr-1" />
              Backend & Frontend Complete
            </div>
          </div>

          {/* Tenant Management Module */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-primary-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Complete
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Tenant Management</h4>
            <p className="text-sm text-gray-600 mb-3">Multi-tenant client management with subscription plans, limits, and complete data isolation.</p>
            <div className="flex items-center text-xs text-gray-500">
              <CheckSquare className="h-3 w-3 mr-1" />
              Backend & Frontend Complete
            </div>
          </div>

          {/* Claims & Security Module */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Backend Only
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Claims & Security</h4>
            <p className="text-sm text-gray-600 mb-3">Fine-grained permission system with role-based security and comprehensive claims management.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Frontend Implementation Pending
            </div>
          </div>

          {/* Team Management Module */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Complete
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Team Management</h4>
            <p className="text-sm text-gray-600 mb-3">Complete team lifecycle management with CQRS, member assignments, team cockpit, and comprehensive team analytics dashboard.</p>
            <div className="flex items-center text-xs text-gray-500">
              <CheckSquare className="h-3 w-3 mr-1" />
              Backend & Frontend Complete
            </div>
          </div>

          {/* Time Tracker Module */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Planned
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Time Tracker</h4>
            <p className="text-sm text-gray-600 mb-3">Comprehensive time tracking with project-based logging, reporting, and productivity analytics.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Development Planned
            </div>
          </div>

          {/* Calendar Module */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Planned
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Calendar Management</h4>
            <p className="text-sm text-gray-600 mb-3">Comprehensive calendar system for events, meetings, deadlines, and company holidays with recurring patterns.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Development Planned
            </div>
          </div>

          {/* Attendance Module */}
          <div className="bg-gradient-to-br from-lime-50 to-lime-100 p-4 rounded-lg border border-lime-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-lime-600 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Planned
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Attendance Management</h4>
            <p className="text-sm text-gray-600 mb-3">Employee attendance tracking with check-in/out, leave management, and workforce analytics.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Development Planned
            </div>
          </div>

          {/* Files Module */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Planned
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">File Management</h4>
            <p className="text-sm text-gray-600 mb-3">Centralized document management with version control, sharing, and secure cloud storage integration.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Development Planned
            </div>
          </div>

          {/* Chat Module */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Planned
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Team Chat</h4>
            <p className="text-sm text-gray-600 mb-3">Real-time messaging system with team channels, direct messages, and file sharing capabilities.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Development Planned
            </div>
          </div>

          {/* Reports & Analytics Module */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Planned
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Reports & Analytics</h4>
            <p className="text-sm text-gray-600 mb-3">Advanced reporting and analytics with customizable dashboards, performance metrics, and data visualization.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Development Planned
            </div>
          </div>

          {/* Compensation/Remuneration Module */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Backend Only
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Compensation Management</h4>
            <p className="text-sm text-gray-600 mb-3">Complete compensation and remuneration management with salary structures, bonuses, and payroll integration.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Frontend Implementation Pending
            </div>
          </div>

          {/* Travel Management Module */}
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-lg border border-sky-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Backend Only
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Travel Management</h4>
            <p className="text-sm text-gray-600 mb-3">Comprehensive travel booking and expense management with approval workflows and reimbursement tracking.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Frontend Implementation Pending
            </div>
          </div>

          {/* Campaign Management Module */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Backend Only
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Campaign Management</h4>
            <p className="text-sm text-gray-600 mb-3">Marketing campaign planning and execution with target audience management and performance tracking.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Frontend Implementation Pending
            </div>
          </div>

          {/* Certificate Management Module */}
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-lg border border-violet-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Backend Only
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Certificate Management</h4>
            <p className="text-sm text-gray-600 mb-3">Digital certificate issuance and management with verification system and automated expiry notifications.</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Frontend Implementation Pending
            </div>
          </div>

        </div>

        {/* Technology Stack Overview */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Technology Stack</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Backend (.NET 9)</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Clean Architecture with CQRS Pattern</li>
                <li>• Entity Framework Core with PostgreSQL</li>
                <li>• JWT Authentication & Authorization</li>
                <li>• AutoMapper & FluentValidation</li>
                <li>• .NET Aspire Orchestration</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Frontend (Next.js 15 + React 19)</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• TypeScript 5.9.2 with Full Type Safety</li>
                <li>• Tailwind CSS with Custom Theme</li>
                <li>• Modern Toast Notification System</li>
                <li>• Responsive Design & Mobile Support</li>
                <li>• Professional Dashboard Analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
