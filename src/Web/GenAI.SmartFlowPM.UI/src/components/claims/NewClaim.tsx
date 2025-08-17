'use client';

import React, { useState } from 'react';
import { CreateClaimDto } from '@/types/api.types';
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

interface NewClaimProps {
  onBack?: () => void;
  onClaimCreated?: () => void;
}

interface FormErrors {
  name?: string;
  type?: string;
  description?: string;
}

const claimTypes = [
  'permission',
  'feature',
  'resource',
  'action',
  'admin',
  'user',
  'module'
];

export const NewClaim: React.FC<NewClaimProps> = ({ onBack, onClaimCreated }) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateClaimDto>({
    name: '',
    type: '',
    description: '',
    isActive: true
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Claim name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Claim name must be at least 3 characters long';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Claim name must not exceed 100 characters';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Claim type is required';
    } else if (formData.type.length < 2) {
      newErrors.type = 'Claim type must be at least 2 characters long';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const newClaim = await claimService.createClaim(formData);
      success('Success', `Claim "${newClaim.name}" has been created successfully.`);
      
      if (onClaimCreated) {
        onClaimCreated();
      }
    } catch (err: any) {
      console.error('Error creating claim:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create claim';
      error('Creation Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateClaimDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Create New Claim</h1>
                <p className="text-sm text-gray-600">Add a new claim to the system</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              disabled={loading}
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
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
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          errors.name ? 'border-red-300' : ''
                        }`}
                        placeholder="Enter claim name"
                        disabled={loading}
                        required
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {formData.name.length}/100 characters
                    </p>
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
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        list="claim-types"
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          errors.type ? 'border-red-300' : ''
                        }`}
                        placeholder="Enter claim type"
                        disabled={loading}
                        required
                      />
                      <datalist id="claim-types">
                        {claimTypes.map((type) => (
                          <option key={type} value={type} />
                        ))}
                      </datalist>
                    </div>
                    {errors.type && (
                      <p className="text-sm text-red-600">{errors.type}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      Common types: {claimTypes.join(', ')}
                    </p>
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
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none ${
                        errors.description ? 'border-red-300' : ''
                      }`}
                      placeholder="Enter claim description (optional)"
                      disabled={loading}
                    />
                  </div>
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {(formData.description || '').length}/500 characters
                  </p>
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
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                      disabled={loading}
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

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onBack}
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
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create Claim</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
