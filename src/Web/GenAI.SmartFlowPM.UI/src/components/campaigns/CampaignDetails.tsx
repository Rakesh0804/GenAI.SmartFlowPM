'use client';

import React, { useState, useEffect } from 'react';
import { campaignService } from '@/services/campaign.service';
import { CampaignDto, CampaignStatus, CampaignType, CampaignEvaluationDto } from '@/types/api.types';
import { 
  Target, 
  Calendar, 
  User, 
  Clock, 
  Edit, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Crown, 
  Users, 
  Building2, 
  Activity,
  BarChart3,
  TrendingUp,
  FileText,
  Star,
  Play,
  Pause,
  StopCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useConfirmationModal } from '@/components/common/ConfirmationModal';

interface CampaignDetailsProps {
  campaignId: string;
  onEdit: () => void;
  onBack: () => void;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  campaignId,
  onEdit,
  onBack
}) => {
  const [campaign, setCampaign] = useState<CampaignDto | null>(null);
  const [evaluations, setEvaluations] = useState<CampaignEvaluationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEvaluations, setLoadingEvaluations] = useState(false);
  const { success, error: showError } = useToast();
  const { showConfirmation, confirmationModal } = useConfirmationModal();

  useEffect(() => {
    loadCampaignDetails();
  }, [campaignId]);

  const loadCampaignDetails = async () => {
    try {
      setLoading(true);
      const campaignData = await campaignService.getCampaignById(campaignId);
      setCampaign(campaignData);
      
      // Load evaluations if campaign is active or completed
      if (campaignData.status === CampaignStatus.Active || campaignData.status === CampaignStatus.Completed) {
        loadEvaluations();
      }
    } catch (error) {
      console.error('Error loading campaign details:', error);
      showError('Failed to load campaign details');
    } finally {
      setLoading(false);
    }
  };

  const loadEvaluations = async () => {
    try {
      setLoadingEvaluations(true);
      const evaluationData = await campaignService.getCampaignEvaluations(campaignId);
      setEvaluations(Array.isArray(evaluationData) ? evaluationData : []);
    } catch (error) {
      console.error('Error loading evaluations:', error);
      // Set empty array and don't show error toast for now since evaluations might not exist yet
      setEvaluations([]);
    } finally {
      setLoadingEvaluations(false);
    }
  };

  const handleStatusChange = async (action: 'start' | 'complete' | 'cancel') => {
    if (!campaign) return;

    const actionConfig = {
      start: {
        title: 'Start Campaign',
        message: `Are you sure you want to start "${campaign.name}"? This will make the campaign active and begin the evaluation process.`,
        confirmText: 'Start Campaign',
        action: () => campaignService.startCampaign(campaignId)
      },
      complete: {
        title: 'Complete Campaign',
        message: `Are you sure you want to complete "${campaign.name}"? This will finalize all evaluations and mark the campaign as completed.`,
        confirmText: 'Complete Campaign',
        action: () => campaignService.completeCampaign(campaignId)
      },
      cancel: {
        title: 'Cancel Campaign',
        message: `Are you sure you want to cancel "${campaign.name}"? This action cannot be undone and will stop all evaluation activities.`,
        confirmText: 'Cancel Campaign',
        action: () => campaignService.cancelCampaign(campaignId)
      }
    };

    const config = actionConfig[action];
    
    showConfirmation({
      title: config.title,
      message: config.message,
      confirmText: config.confirmText,
      onConfirm: async () => {
        try {
          await config.action();
          success(`Campaign ${action}ed successfully`);
          loadCampaignDetails();
        } catch (error) {
          console.error(`Error ${action}ing campaign:`, error);
          showError(`Failed to ${action} campaign`);
        }
      }
    });
  };

  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.Active:
        return {
          text: 'Active',
          className: 'bg-green-100 text-green-700 border-green-200',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case CampaignStatus.Completed:
        return {
          text: 'Completed',
          className: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case CampaignStatus.Draft:
        return {
          text: 'Draft',
          className: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <AlertCircle className="w-4 h-4" />
        };
      case CampaignStatus.Paused:
        return {
          text: 'Paused',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <Pause className="w-4 h-4" />
        };
      case CampaignStatus.Cancelled:
        return {
          text: 'Cancelled',
          className: 'bg-red-100 text-red-700 border-red-200',
          icon: <XCircle className="w-4 h-4" />
        };
      default:
        return {
          text: 'Unknown',
          className: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <AlertCircle className="w-4 h-4" />
        };
    }
  };

  const getTypeBadge = (type: CampaignType) => {
    switch (type) {
      case CampaignType.Performance:
        return { text: 'Performance', className: 'bg-purple-50 text-purple-700 border-purple-200' };
      case CampaignType.Training:
        return { text: 'Training', className: 'bg-blue-50 text-blue-700 border-blue-200' };
      case CampaignType.Evaluation:
        return { text: 'Evaluation', className: 'bg-orange-50 text-orange-700 border-orange-200' };
      case CampaignType.Development:
        return { text: 'Development', className: 'bg-green-50 text-green-700 border-green-200' };
      default:
        return { text: 'Unknown', className: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    if (!evaluations?.length) return 0;
    const completed = evaluations.filter(e => e.isCompleted).length;
    return Math.round((completed / evaluations.length) * 100);
  };

  const getStatusActions = () => {
    if (!campaign) return [];

    switch (campaign.status) {
      case CampaignStatus.Draft:
        return [
          {
            label: 'Start Campaign',
            action: () => handleStatusChange('start'),
            icon: <Play className="w-4 h-4" />,
            className: 'text-green-600 hover:bg-green-50'
          }
        ];
      case CampaignStatus.Active:
        return [
          {
            label: 'Complete Campaign',
            action: () => handleStatusChange('complete'),
            icon: <CheckCircle className="w-4 h-4" />,
            className: 'text-blue-600 hover:bg-blue-50'
          },
          {
            label: 'Cancel Campaign',
            action: () => handleStatusChange('cancel'),
            icon: <StopCircle className="w-4 h-4" />,
            className: 'text-red-600 hover:bg-red-50'
          }
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Campaign not found</p>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(campaign.status);
  const typeBadge = getTypeBadge(campaign.type);
  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-8 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusBadge.className}`}>
                  {statusBadge.icon}
                  <span className="ml-1">{statusBadge.text}</span>
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${typeBadge.className}`}>
                  {typeBadge.text}
                </span>
              </div>
              <p className="text-lg text-gray-700 mb-4 max-w-2xl">
                {campaign.description || 'No description provided'}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>{campaign.assignedManagers?.length || 0} manager{(campaign.assignedManagers?.length || 0) !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{campaign.targetUserGroups?.length || 0} group{(campaign.targetUserGroups?.length || 0) !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              
              {getStatusActions().length > 0 && (
                <div className="relative">
                  <div className="flex items-center space-x-1">
                    {getStatusActions().map((action, index) => (
                      <button
                        key={`action-${action.label}-${index}`}
                        onClick={action.action}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${action.className}`}
                      >
                        {action.icon}
                        <span className="ml-1">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Evaluations</p>
              <p className="text-2xl font-bold text-gray-900">{evaluations?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {evaluations?.filter(e => e.isCompleted).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {evaluations?.filter(e => !e.isCompleted).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <p className="text-2xl font-bold text-gray-900">{progress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Managers */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Assigned Managers</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {campaign.assignedManagers?.map((manager, index) => (
                <div key={manager.id || `manager-${index}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {manager.userName?.split(' ').map((n, i) => n[0]).join('') || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{manager.userName || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500">{manager.userEmail || 'No email'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Target Groups */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Target Groups</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {campaign.targetUserGroups?.map((group, index) => (
                <div key={group.id || `group-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{group.name}</p>
                      <p className="text-xs text-gray-500">{group.users?.length || 0} member{(group.users?.length || 0) !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Evaluations List */}
      {(campaign.status === CampaignStatus.Active || campaign.status === CampaignStatus.Completed) && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Evaluations</h3>
              </div>
              {progress > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{progress}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            {loadingEvaluations ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
                <p className="text-gray-600">Loading evaluations...</p>
              </div>
            ) : (evaluations?.length || 0) > 0 ? (
              <div className="space-y-3">
                {evaluations?.map((evaluation, index) => (
                  <div key={evaluation.id || `evaluation-${index}`} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {evaluation.evaluatedUserName || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {evaluation.isCompleted ? 'Completed' : 'Pending'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {evaluation.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Evaluations Yet</h3>
                <p className="text-gray-500">Evaluations will appear here once the campaign is active</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal}
    </div>
  );
};

export default CampaignDetails;
