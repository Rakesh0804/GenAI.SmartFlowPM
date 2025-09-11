'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { campaignService } from '@/services/campaign.service';
import { CampaignType, CampaignStatus, CampaignDto, CampaignManagerDto, CampaignGroupDto } from '@/interfaces/campaign.interfaces';
import { CreateCampaignRequest, UpdateCampaignRequest } from '@/services/campaign.service';
import { 
  Save, 
  X, 
  Calendar, 
  Users, 
  Target, 
  FileText, 
  Crown,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import SearchableSelect from '@/components/common/SearchableSelect';
import CustomSelect from '@/components/common/CustomSelect';

interface CampaignFormProps {
  mode: 'create' | 'edit';
  campaignId?: string;
  onSave: (campaignData: any) => void;
  onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  mode,
  campaignId,
  onSave,
  onCancel
}) => {
  const router = useRouter();
  const { success, error: showError } = useToast();
  
  // Form state
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: CampaignType.Performance,
    startDate: '',
    endDate: '',
    assignedGroupIds: [] as string[],
    targetUserGroupIds: [] as string[]
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Data state
  const [availableGroups, setAvailableGroups] = useState<CampaignGroupDto[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<CampaignGroupDto[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Load campaign data for edit mode
  useEffect(() => {
    if (mode === 'edit' && campaignId) {
      loadCampaignData();
    }
    loadAvailableGroups();
  }, [mode, campaignId]);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      const campaign = await campaignService.getCampaignById(campaignId!);
      
      // Ensure arrays exist or provide empty arrays as fallbacks
      const assignedManagers = campaign.assignedManagers || [];
      const targetUserGroups = campaign.targetUserGroups || [];

      setFormData({
        name: campaign.title || '',
        description: campaign.description || '',
        type: campaign.type,
        startDate: new Date(campaign.startDate).toISOString().split('T')[0],
        endDate: new Date(campaign.endDate).toISOString().split('T')[0],
        assignedGroupIds: Array.isArray(assignedManagers) 
          ? assignedManagers as unknown as string[]
          : [],
        targetUserGroupIds: Array.isArray(targetUserGroups)
          ? targetUserGroups.map(g => typeof g === 'string' ? g : g.id)
          : []
      });

      // Convert assigned managers to campaign groups
      let selectedGroupsData: CampaignGroupDto[] = [];
      
      if (Array.isArray(assignedManagers) && assignedManagers.length > 0) {
        try {
          const groupIds = assignedManagers as unknown as string[];
          const groupPromises = groupIds.map(async (groupId: string) => {
            try {
              return await campaignService.getCampaignGroupById(groupId);
            } catch (error) {
              console.warn(`Failed to fetch group ${groupId}:`, error);
              return null;
            }
          });
          
          const groups = await Promise.all(groupPromises);
          selectedGroupsData = groups.filter((group): group is CampaignGroupDto => group !== null);
        } catch (error) {
          console.warn('Error fetching group details:', error);
        }
      }

      setSelectedGroups(selectedGroupsData);
    } catch (error) {
      console.error('Error loading campaign:', error);
      showError('Failed to load campaign data');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableGroups = async () => {
    try {
      setLoadingGroups(true);
      const groups = await campaignService.getCampaignGroups();
      setAvailableGroups(groups);
    } catch (error) {
      console.error('Error loading campaign groups:', error);
      showError('Failed to load available groups');
    } finally {
      setLoadingGroups(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.assignedGroupIds.length === 0) {
      newErrors.groups = 'At least one group must be assigned';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      if (mode === 'create') {
        const createDto: CreateCampaignRequest = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          type: formData.type,
          status: CampaignStatus.Draft,
          startDate: formData.startDate,
          endDate: formData.endDate,
          assignedManagerIds: formData.assignedGroupIds,
          targetUserGroupIds: formData.targetUserGroupIds
        };
        
        const newCampaign = await campaignService.createCampaign(createDto);
        success('Campaign created successfully');
        onSave(newCampaign);
      } else {
        const updateDto: UpdateCampaignRequest = {
          id: campaignId!,
          name: formData.name.trim(),
          description: formData.description.trim(),
          type: formData.type,
          status: CampaignStatus.Draft,
          startDate: formData.startDate,
          endDate: formData.endDate,
          assignedManagerIds: formData.assignedGroupIds,
          targetUserGroupIds: formData.targetUserGroupIds
        };
        
        const updatedCampaign = await campaignService.updateCampaign(updateDto);
        success('Campaign updated successfully');
        onSave(updatedCampaign);
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      showError(mode === 'create' ? 'Failed to create campaign' : 'Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  const handleGroupAdd = (groupId: string) => {
    const group = availableGroups.find(g => g.id === groupId);
    if (group && !formData.assignedGroupIds.includes(groupId)) {
      setFormData(prev => ({
        ...prev,
        assignedGroupIds: [...prev.assignedGroupIds, groupId]
      }));
      setSelectedGroups(prev => [...prev, group]);
    }
  };

  const handleGroupRemove = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedGroupIds: prev.assignedGroupIds.filter(id => id !== groupId)
    }));
    setSelectedGroups(prev => prev.filter(g => g.id !== groupId));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary-600" />
          <p className="text-gray-600">Loading campaign data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Header */}
        <div key="form-header" className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {mode === 'create' ? 'Create New Campaign' : 'Edit Campaign'}
                </h2>
                <p className="text-sm text-gray-600">
                  {mode === 'create' ? 'Fill in the details to create a new evaluation campaign' : 'Update the campaign details as needed'}
                </p>
              </div>
            </div>
            
            {/* Back Button */}
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div key="form-content" className="px-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>

            {/* Campaign Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Enter campaign name"
                disabled={saving}
              />
              {errors.name && (
                <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                placeholder="Enter campaign description"
                disabled={saving}
              />
            </div>

            {/* Campaign Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Type *
              </label>
              <CustomSelect
                value={formData.type.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, type: parseInt(value) as CampaignType }))}
                options={[
                  { value: CampaignType.Performance.toString(), label: 'Performance' },
                  { value: CampaignType.Training.toString(), label: 'Training' },
                  { value: CampaignType.Evaluation.toString(), label: 'Evaluation' },
                  { value: CampaignType.Development.toString(), label: 'Development' }
                ]}
                placeholder="Select campaign type"
                disabled={saving}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    disabled={saving}
                  />
                </div>
                {errors.startDate && (
                  <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.startDate}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    disabled={saving}
                  />
                </div>
                {errors.endDate && (
                  <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.endDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assigned Groups */}
          <div key="assigned-groups" className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900">Assigned Groups</h3>
            </div>

            {/* Group Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Groups to Assign *
              </label>
              <SearchableSelect
                placeholder="Search and select groups..."
                value=""
                onChange={(groupId: string) => handleGroupAdd(groupId)}
                onSearch={async (query: string) => {
                  if (!query) return [];
                  return availableGroups
                    .filter(group => 
                      !formData.assignedGroupIds.includes(group.id) &&
                      group.name.toLowerCase().includes(query.toLowerCase())
                    )
                    .map(group => ({
                      id: group.id,
                      label: group.name,
                      sublabel: group.description || `${group.targetUserIds?.length || 0} members`
                    }));
                }}
                initialOptions={availableGroups
                  .filter(group => !formData.assignedGroupIds.includes(group.id))
                  .map(group => ({
                    id: group.id,
                    label: group.name,
                    sublabel: group.description || `${group.targetUserIds?.length || 0} members`
                  }))}
                disabled={saving}
              />
              {errors.groups && (
                <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.groups}</span>
                </div>
              )}
            </div>

            {/* Selected Groups */}
            {selectedGroups.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Groups ({selectedGroups.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedGroups.map((group, index) => (
                    <div
                      key={group.id || `group-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {group.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {group.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {group.description || `${group.targetUserIds?.length || 0} members`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGroupRemove(group.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                        title="Remove group"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div key="form-actions" className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex items-center px-8 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Create Campaign' : 'Update Campaign'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;