'use client';

import React, { useState, useEffect } from 'react';
import { ClaimDto, UpdateClaimDto } from '@/types/api.types';
import { claimService } from '@/services/claim.service';
import { useToast } from '@/contexts/ToastContext';
import { 
  Key, 
  Save, 
  X, 
  Loader2,
  Type,
  FileText,
  ArrowLeft
} from 'lucide-react';

interface EditClaimProps {
  claimId: string;
  onClaimUpdated?: (claim: ClaimDto) => void;
  onCancel?: () => void;
  onBack?: () => void;
  readOnly?: boolean;
}

interface FormErrors {
  name?: string;
  type?: string;
  description?: string;
  general?: string;
}

export const EditClaim: React.FC<EditClaimProps> = ({
  claimId,
  onClaimUpdated,
  onCancel,
  onBack,
  readOnly = false
}) => {
  const { success: showSuccess, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [originalClaim, setOriginalClaim] = useState<ClaimDto | null>(null);
  const [formData, setFormData] = useState<UpdateClaimDto>({
    name: '',
    type: '',
    description: '',
    isActive: true
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const commonTypes = [
    'permission',
    'feature',
    'resource',
    'action',
    'view',
    'edit',
    'delete',
    'create',
    'manage'
  ];

  useEffect(() => {
    loadClaim();
  }, [claimId]);

  const loadClaim = async () => {
    try {
      setInitialLoading(true);
      const claim = await claimService.getClaimById(claimId);
      setOriginalClaim(claim);
      setFormData({
        name: claim.name,
        type: claim.type,
        description: claim.description || '',
        isActive: claim.isActive
      });
    } catch (error: any) {
      console.error('Error loading claim:', error);
      showError('Failed to load claim details');
      if (onBack) onBack();
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (readOnly) return;
    
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Claim name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Claim name must be at least 2 characters long';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Claim name must not exceed 100 characters';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Claim type is required';
    } else if (formData.type.length < 2) {
      newErrors.type = 'Claim type must be at least 2 characters long';
    } else if (formData.type.length > 100) {
      newErrors.type = 'Claim type must not exceed 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (readOnly) return;

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const updateData: UpdateClaimDto = {
        name: formData.name.trim(),
        type: formData.type.trim(),
        description: formData.description?.trim() || '',
        isActive: formData.isActive
      };

      const updatedClaim = await claimService.updateClaim(claimId, updateData);
      showSuccess('Claim updated successfully');
      
      if (onClaimUpdated) {
        onClaimUpdated(updatedClaim);
      }
    } catch (error: any) {
      console.error('Error updating claim:', error);
      
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const serverErrors: FormErrors = {};
        const errorData = error.response.data.errors;
        
        if (errorData.Name) {
          serverErrors.name = errorData.Name[0];
        }
        if (errorData.Type) {
          serverErrors.type = errorData.Type[0];
        }
        if (errorData.Description) {
          serverErrors.description = errorData.Description[0];
        }
        
        setErrors(serverErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        showError('Failed to update claim. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onBack) {
      onBack();
    }
  };

  if (initialLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin h-6 w-6 text-primary-600" />
          <span className="text-gray-600">Loading claim details...</span>
        </div>
      </div>
    );
  }

  if (!originalClaim) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Claim not found</h3>
          <p className="text-gray-500 mb-4">The claim you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex-none">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                disabled={loading}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Key className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {readOnly ? 'View Claim' : 'Edit Claim'}
                </h1>
                <p className="text-sm text-gray-600">
                  {readOnly ? 'View claim details' : 'Update claim information'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              disabled={loading}
            >
              <X className="w-4 h-4" />
              <span>{readOnly ? 'Close' : 'Cancel'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area - Full width, no extra padding */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Form Section */}
          <div className="w-full bg-white">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Basic Information</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Claim Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          readOnly ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                        placeholder="Enter claim name"
                        disabled={loading || readOnly}
                        required
                        readOnly={readOnly}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Claim Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        list="claim-types"
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          readOnly ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                        placeholder="Enter claim type"
                        disabled={loading || readOnly}
                        required
                        readOnly={readOnly}
                      />
                      {!readOnly && (
                        <datalist id="claim-types">
                          {commonTypes.map((type) => (
                            <option key={type} value={type} />
                          ))}
                        </datalist>
                      )}
                    </div>
                    {errors.type && (
                      <p className="text-sm text-red-600">{errors.type}</p>
                    )}
                    {!readOnly && (
                      <p className="text-sm text-gray-500">
                        Common types: {commonTypes.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none ${
                        readOnly ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                      placeholder="Enter claim description (optional)"
                      disabled={loading || readOnly}
                      readOnly={readOnly}
                    />
                  </div>
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                  {!readOnly && (
                    <p className="text-sm text-gray-500">
                      {formData.description?.length || 0}/500 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Status Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className={`w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 ${
                        readOnly ? 'cursor-not-allowed' : ''
                      }`}
                      disabled={loading || readOnly}
                    />
                    <label htmlFor="isActive" className="flex items-center text-sm font-medium text-gray-700">
                      <Key className="w-5 h-5 mr-2 text-primary-600" />
                      Active Claim
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 ml-8">
                    Active claims can be assigned to users and used for authorization
                  </p>
                </div>
              </div>

              {/* Metadata Section */}
              {originalClaim && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Metadata</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Created</label>
                      <p className="text-sm text-gray-900">
                        {new Date(originalClaim.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    {originalClaim.updatedAt && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                        <p className="text-sm text-gray-900">
                          {new Date(originalClaim.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Form Actions */}
              {!readOnly && (
                <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-8 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-8 py-3 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Update Claim</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClaim;
