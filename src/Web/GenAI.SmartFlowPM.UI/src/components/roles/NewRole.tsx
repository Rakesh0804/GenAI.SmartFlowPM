'use client';

import React, { useState } from 'react';
import { CreateRoleDto } from '@/types/api.types';
import { roleService } from '@/services/role.service';
import { useToast } from '@/contexts/ToastContext';
import { Shield, Save, X, Loader2, Plus } from 'lucide-react';

interface NewRoleProps {
  onRoleCreated?: () => void;
  onCancel?: () => void;
  onBack?: () => void;
}

export const NewRole: React.FC<NewRoleProps> = ({
  onRoleCreated,
  onCancel,
  onBack
}) => {
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();
  const [formData, setFormData] = useState<CreateRoleDto>({
    name: '',
    description: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Role description is required';
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
      await roleService.createRole(formData);
      success('Role created successfully!');
      
      if (onRoleCreated) {
        onRoleCreated();
      }
    } catch (err) {
      console.error('Error creating role:', err);
      error('Failed to create role. Please try again.');
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create role. Please try again.'
      }));
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

  return (
    <div className="h-full w-full flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex-none">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Plus className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Role</h1>
                <p className="text-sm text-gray-600">Add a new role to the system</p>
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
              {/* Role Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Role Information</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Role Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Enter role name"
                        disabled={loading}
                        required
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                        disabled={loading}
                      />
                      <label htmlFor="isActive" className="flex items-center text-sm font-medium text-gray-700">
                        <Shield className="w-5 h-5 mr-2 text-primary-600" />
                        Active Role
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 ml-8">
                      Check if this role should be available for assignment
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                    placeholder="Enter role description and responsibilities"
                    disabled={loading}
                    required
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Form Actions */}
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
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create Role</span>
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
