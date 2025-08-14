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
      {/* Header */}
      <div className="flex-none bg-white border-b border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between">
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
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Key className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Create New Claim</h1>
                  <p className="text-gray-600">Add a new claim to the system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Claim Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Claim Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter claim name (e.g., users.read, admin.access)"
                        disabled={loading}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.name.length}/100 characters
                    </p>
                  </div>

                  {/* Claim Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Claim Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="type"
                        list="claim-types"
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.type ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Select or enter claim type"
                        disabled={loading}
                      />
                      <datalist id="claim-types">
                        {claimTypes.map((type) => (
                          <option key={type} value={type} />
                        ))}
                      </datalist>
                    </div>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <textarea
                        id="description"
                        rows={4}
                        value={formData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                          errors.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Optional description for the claim"
                        disabled={loading}
                      />
                    </div>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      {(formData.description || '').length}/500 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Status</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Key className="w-5 h-5 mr-2 text-blue-600" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Claim Status</h3>
                        <p className="text-sm text-gray-500">
                          {formData.isActive ? 'This claim will be active immediately' : 'This claim will be created as inactive'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('isActive', !formData.isActive)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        formData.isActive ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                      disabled={loading}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          formData.isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
