'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Megaphone, CalendarDays, Activity, TrendingUp, BarChart3, PieChart } from 'lucide-react';
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <DashboardContent />;
}

function DashboardContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Chart data
  const taskStatusData = [
    { name: 'Open', value: 15, color: '#3B82F6' },
    { name: 'In Progress', value: 22, color: '#F59E0B' },
    { name: 'Completed', value: 47, color: '#10B981' },
    { name: 'Blocked', value: 6, color: '#EF4444' }
  ];

  const projectStatusData = [
    { name: 'Project Alpha', open: 5, inProgress: 8, completed: 12, total: 25 },
    { name: 'Project Beta', open: 3, inProgress: 6, completed: 15, total: 24 },
    { name: 'Project Gamma', open: 4, inProgress: 5, completed: 11, total: 20 },
    { name: 'Project Delta', open: 2, inProgress: 3, completed: 8, total: 13 },
    { name: 'Project Echo', open: 1, inProgress: 0, completed: 1, total: 2 }
  ];

  const taskTypeData = [
    { name: 'Task', value: 35, color: '#8B5CF6' },
    { name: 'Bug', value: 12, color: '#EF4444' },
    { name: 'Spike', value: 8, color: '#F59E0B' },
    { name: 'Story', value: 25, color: '#10B981' },
    { name: 'Epic', value: 10, color: '#3B82F6' }
  ];

  const burndownData = [
    { day: 'Day 1', planned: 100, actual: 100 },
    { day: 'Day 2', planned: 90, actual: 95 },
    { day: 'Day 3', planned: 80, actual: 88 },
    { day: 'Day 4', planned: 70, actual: 78 },
    { day: 'Day 5', planned: 60, actual: 65 },
    { day: 'Day 6', planned: 50, actual: 52 },
    { day: 'Day 7', planned: 40, actual: 45 },
    { day: 'Day 8', planned: 30, actual: 35 },
    { day: 'Day 9', planned: 20, actual: 22 },
    { day: 'Day 10', planned: 10, actual: 15 },
    { day: 'Day 11', planned: 0, actual: 8 }
  ];

  const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Tasks</p>
              <p className="text-3xl font-bold text-gray-900">47</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Team Members</p>
              <p className="text-3xl font-bold text-gray-900">8</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-3xl font-bold text-gray-900">156</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-blue-600" />
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
                  {taskStatusData.map((entry, index) => (
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
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
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
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-600" />
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
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">MB</span>
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Megaphone className="h-6 w-6 text-blue-600" />
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
            <button className="text-blue-600 text-sm hover:text-blue-700 transition-colors">
              View all announcements →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
