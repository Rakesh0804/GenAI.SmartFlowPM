'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Info 
} from 'lucide-react';
import { roleService } from '@/services/role.service';
import { RoleDto, UpdateRoleDto } from '@/types/api.types';
import { useToast } from '@/contexts/ToastContext';

interface EditRoleProps {
  roleId: string;
  readOnly?: boolean;
  onBack: () => void;
  onRoleUpdated?: (role: RoleDto) => void;
}

interface FormData {
  name: string;
  description: string;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  general?: string;
}

export const EditRole: React.FC<EditRoleProps> = ({
  roleId,
  readOnly = false,
  onBack,
  onRoleUpdated
}) => {
  const { success: showSuccess, error: showError } = useToast();
  const [role, setRole] = useState<RoleDto | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    isActive: true
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    loadRole();
  }, [roleId]);

  const loadRole = async () => {
    try {
      setLoadingRole(true);
      const roleData = await roleService.getRoleById(roleId);
      setRole(roleData);
      setFormData({
        name: roleData.name || '',
        description: roleData.description || '',
        isActive: roleData.isActive
      });
    } catch (error) {
      console.error('Error loading role:', error);
      showError('Failed to load role details');
    } finally {
      setLoadingRole(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Role name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Role name must be at least 2 characters long';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Role name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear related errors
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
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

      const updateData: UpdateRoleDto = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        isActive: formData.isActive
      };

      const updatedRole = await roleService.updateRole(roleId, updateData);
      showSuccess('Role updated successfully');
      
      if (onRoleUpdated) {
        onRoleUpdated(updatedRole);
      }
    } catch (error: any) {
      console.error('Error updating role:', error);
      
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const serverErrors: FormErrors = {};
        const errorData = error.response.data.errors;
        
        if (errorData.Name) {
          serverErrors.name = errorData.Name[0];
        }
        if (errorData.Description) {
          serverErrors.description = errorData.Description[0];
        }
        
        setErrors(serverErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        showError('Failed to update role. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loadingRole) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading role details...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Role Not Found</h3>
          <p className="text-gray-600 mb-4">The requested role could not be found.</p>
          <button
            onClick={onBack}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Roles
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
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {readOnly ? 'View Role' : 'Edit Role'}
                </h1>
                <p className="text-sm text-gray-600">
                  {readOnly ? 'Role details and information' : 'Modify role settings and permissions'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {readOnly && (
              <div className="flex items-center space-x-1 text-primary-600">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">View Mode</span>
              </div>
            )}
            
            <button
              type="button"
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Roles</span>
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
                  {/* Role Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Role Name {!readOnly && <span className="text-red-500">*</span>}
                    </label>
                    {readOnly ? (
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <div className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {formData.name || 'Not specified'}
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter role name (e.g., Administrator, Manager, User)"
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          disabled={loading}
                          required
                        />
                      </div>
                    )}
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                    {!readOnly && (
                      <p className="text-xs text-gray-500">
                        Choose a descriptive name that clearly identifies the role's purpose
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    {readOnly ? (
                      <div className="flex items-center space-x-2 py-3">
                        {formData.isActive ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-600 font-medium">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-600 font-medium">Inactive</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-6 py-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="isActive"
                            checked={formData.isActive === true}
                            onChange={() => handleInputChange('isActive', true)}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="isActive"
                            checked={formData.isActive === false}
                            onChange={() => handleInputChange('isActive', false)}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-gray-700">Inactive</span>
                        </label>
                      </div>
                    )}
                    {!readOnly && (
                      <p className="text-xs text-gray-500">
                        Active roles can be assigned to users. Inactive roles are hidden from selection.
                      </p>
                    )}
                  </div>
                </div>

                {/* Description - Full width */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  {readOnly ? (
                    <div className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[120px]">
                      {formData.description || 'No description provided'}
                    </div>
                  ) : (
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the role's responsibilities and permissions..."
                      className={`w-full px-3 py-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                  )}
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                  {!readOnly && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Optional: Provide details about this role's purpose and scope</span>
                      <span>{formData.description?.length || 0}/500</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Role Metadata (View Mode Only) */}
              {readOnly && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Role Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Created Date</label>
                      <div className="flex items-center space-x-2 text-gray-900 py-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(role.createdAt?.toString() || '')}</span>
                      </div>
                    </div>
                    
                    {role.updatedAt && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                        <div className="flex items-center space-x-2 text-gray-900 py-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(role.updatedAt.toString())}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Information Notice */}
              {!readOnly && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-primary-800">
                      <p className="font-medium mb-1">Role Management Information</p>
                      <ul className="list-disc list-inside space-y-1 text-primary-700">
                        <li>Changes to roles will affect all users assigned to this role</li>
                        <li>Deactivating a role will prevent it from being assigned to new users</li>
                        <li>Existing user assignments will remain but may lose associated permissions</li>
                        <li>Consider the impact on system security before making changes</li>
                      </ul>
                    </div>
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
                    onClick={onBack}
                    disabled={loading}
                    className="flex items-center space-x-2 px-8 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-8 py-3 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
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
