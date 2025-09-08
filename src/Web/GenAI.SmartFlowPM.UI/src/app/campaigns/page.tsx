'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  CheckCircle,
  XCircle,
  Calendar,
  Target,
  Activity,
  Edit,
  Eye,
  Loader2
} from 'lucide-react';
import { 
  CampaignDto, 
  CampaignStatisticsDto, 
  CampaignActivityDto,
  CampaignStatus,
  CampaignType 
} from '@/types/api.types';
import { campaignService } from '@/services/campaign.service';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Status badge component
const StatusBadge = ({ status }: { status: CampaignStatus }) => {
  switch (status) {
    case CampaignStatus.Active:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
    case CampaignStatus.Completed:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Completed</span>;
    case CampaignStatus.Draft:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
    case CampaignStatus.Paused:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Paused</span>;
    case CampaignStatus.Cancelled:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
  }
};

// Type badge component
const TypeBadge = ({ type }: { type: CampaignType }) => {
  switch (type) {
    case CampaignType.Performance:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">Performance</span>;
    case CampaignType.Training:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Training</span>;
    case CampaignType.Evaluation:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">Evaluation</span>;
    case CampaignType.Development:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Development</span>;
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">Unknown</span>;
  }
};

const CampaignsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<CampaignStatisticsDto | null>(null);
  const [activeCampaigns, setActiveCampaigns] = useState<CampaignDto[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<CampaignDto[]>([]);
  const [recentActivities, setRecentActivities] = useState<CampaignActivityDto[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load dashboard overview data
      const [statsData, campaignsData, activitiesData] = await Promise.all([
        campaignService.getDashboardOverview(),
        campaignService.getCampaigns(),
        campaignService.getRecentActivities(10)
      ]);

      setStatistics(statsData);
      setAllCampaigns(campaignsData);
      setActiveCampaigns(campaignsData.filter(c => c.status === CampaignStatus.Active));
      setRecentActivities(activitiesData.activities || []);

      // Load progress data for charts
      try {
        const progressAnalytics = await campaignService.getProgressAnalytics();
        if (progressAnalytics?.campaignProgressData) {
          setProgressData(progressAnalytics.campaignProgressData);
        }
      } catch (progressError) {
        console.warn('Progress analytics not available:', progressError);
      }

    } catch (error) {
      console.error('Error loading campaigns:', error);
      setError('Failed to load campaign data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignAction = async (campaignId: string, action: 'start' | 'complete' | 'cancel') => {
    try {
      switch (action) {
        case 'start':
          await campaignService.startCampaign(campaignId);
          break;
        case 'complete':
          await campaignService.completeCampaign(campaignId);
          break;
        case 'cancel':
          await campaignService.cancelCampaign(campaignId);
          break;
      }
      
      // Reload data
      loadDashboardData();
    } catch (error) {
      console.error(`Failed to ${action} campaign:`, error);
    }
  };

  const filteredCampaigns = allCampaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chart data preparation
  const chartData = progressData.map(item => ({
    name: item.campaignName || 'Unknown',
    completed: item.completed || 0,
    pending: item.pending || 0,
    total: item.total || 0,
    percentage: item.percentage || 0
  }));

  const statusDistribution = [
    { name: 'Active', value: statistics?.activeCampaigns || 0, color: '#10b981' },
    { name: 'Completed', value: statistics?.completedCampaigns || 0, color: '#3b82f6' },
    { name: 'Draft', value: statistics?.draftCampaigns || 0, color: '#6b7280' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Campaigns</h2>
          <p className="text-gray-600 mt-1">Manage and track your campaign performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'dashboard', name: 'Dashboard' },
            { id: 'campaigns', name: 'All Campaigns' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
          {/* Navigation Buttons */}
          <div className="flex-1 flex justify-end space-x-4">
            <button
              onClick={() => router.push('/campaigns/cockpit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Target className="mr-2 h-4 w-4" />
              Cockpit
            </button>
            <button
              onClick={() => router.push('/campaigns/groups')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Users className="mr-2 h-4 w-4" />
              Groups
            </button>
          </div>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics?.totalCampaigns || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics?.activeCampaigns || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Evaluations</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics?.pendingEvaluations || 0}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {statistics?.averageCompletionRate?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Campaign Progress</h3>
                  <p className="text-gray-500 text-sm mt-1">Evaluation completion status</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" stackId="a" fill="#10b981" />
                    <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
                  <p className="text-gray-500 text-sm mt-1">Campaign status breakdown</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {statusDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <p className="text-gray-500 text-sm mt-1">Latest campaign activities and updates</p>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {activity.performedByName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.campaignName} • {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <Activity className="h-4 w-4 text-gray-400" />
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activities</h3>
                  <p className="mt-1 text-sm text-gray-500">Campaign activities will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Tab - Active Campaigns Cards */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{campaign.description}</p>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={campaign.status} />
                      <TypeBadge type={campaign.type} />
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{campaign.assignedManagers.length} managers • {campaign.targetUserGroups.length} groups</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative ml-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button 
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => handleCampaignAction(campaign.id, 'complete')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete
                  </button>
                  <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          {activeCampaigns.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No active campaigns</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new campaign</p>
            </div>
          )}
        </div>
      )}

      {/* All Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Campaigns List */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                        <StatusBadge status={campaign.status} />
                        <TypeBadge type={campaign.type} />
                      </div>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{campaign.assignedManagers.length} managers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4" />
                          <span>{campaign.targetUserGroups.length} groups</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {campaign.status === CampaignStatus.Draft && (
                        <button 
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          onClick={() => handleCampaignAction(campaign.id, 'start')}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start
                        </button>
                      )}
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first campaign'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
