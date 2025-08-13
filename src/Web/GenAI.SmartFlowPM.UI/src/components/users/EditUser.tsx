'use client';

import React, { useState, useEffect } from 'react';
import { UserDto, UpdateUserDto } from '@/types/api.types';
import { userService } from '@/services/user.service';
import { 
  User, 
  Mail, 
  Phone, 
  Save, 
  X, 
  Edit,
  Users,
  Loader
} from 'lucide-react';

interface EditUserProps {
  userId: string;
  onUserUpdated?: () => void;
  onCancel?: () => void;
  onBack?: () => void;
}

export const EditUser: React.FC<EditUserProps> = ({
  userId,
  onUserUpdated,
  onCancel,
  onBack
}) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [originalUser, setOriginalUser] = useState<UserDto | null>(null);
  const [formData, setFormData] = useState<UpdateUserDto>({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    phoneNumber: '',
    managerId: '',
    hasReportee: false,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setInitialLoading(true);
      const user = await userService.getUserById(userId);
      setOriginalUser(user);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userName: user.userName,
        phoneNumber: user.phoneNumber || '',
        managerId: user.managerId || '',
        hasReportee: user.hasReportee,
        isActive: user.isActive
      });
    } catch (error) {
      console.error('Error loading user:', error);
      alert('Failed to load user details');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.userName?.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Username must be at least 3 characters long';
    }

    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = (): boolean => {
    if (!originalUser) return false;
    
    return (
      formData.firstName !== originalUser.firstName ||
      formData.lastName !== originalUser.lastName ||
      formData.email !== originalUser.email ||
      formData.userName !== originalUser.userName ||
      formData.phoneNumber !== (originalUser.phoneNumber || '') ||
      formData.managerId !== (originalUser.managerId || '') ||
      formData.hasReportee !== originalUser.hasReportee ||
      formData.isActive !== originalUser.isActive
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!hasChanges()) {
      alert('No changes to save');
      return;
    }

    try {
      setLoading(true);
      
      await userService.updateUser(userId, formData);
      alert('User updated successfully!');
      
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      
      // Handle specific API errors
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: string) => {
          if (err.includes('email')) {
            apiErrors.email = 'Email address is already in use';
          } else if (err.includes('username')) {
            apiErrors.userName = 'Username is already taken';
          } else {
            alert(`Error: ${err}`);
          }
        });
        setErrors(prev => ({ ...prev, ...apiErrors }));
      } else {
        alert('Failed to update user. Please try again.');
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
      <div className="page-container">
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-3 text-gray-600">Loading user details...</span>
        </div>
      </div>
    );
  }

  if (!originalUser) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
          <p className="text-gray-500 mb-4">The requested user could not be loaded.</p>
          <button onClick={handleCancel} className="btn btn-primary">
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
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Edit className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                <p className="text-sm text-gray-600">
                  Update details for {originalUser.firstName} {originalUser.lastName}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Personal Information</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter first name"
                        disabled={loading}
                        required
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter last name"
                        disabled={loading}
                        required
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter email address"
                        disabled={loading}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter phone number"
                        disabled={loading}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={formData.userName || ''}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter username"
                        disabled={loading}
                        required
                      />
                    </div>
                    {errors.userName && (
                      <p className="text-sm text-red-600">{errors.userName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">
                      Manager ID
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="managerId"
                        name="managerId"
                        value={formData.managerId || ''}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter manager ID (optional)"
                        disabled={loading}
                      />
                    </div>
                    {errors.managerId && (
                      <p className="text-sm text-red-600">{errors.managerId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Role & Status */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Role & Status</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="hasReportee"
                        name="hasReportee"
                        checked={formData.hasReportee || false}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <label htmlFor="hasReportee" className="ml-3 flex items-center text-sm font-medium text-gray-700">
                        <Users className="w-4 h-4 mr-2" />
                        Manager Role
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 ml-7">
                      Check this if the user manages other team members
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive || false}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
                        Active User Account
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 ml-7">
                      Inactive users cannot sign in to the system
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Placeholder for future status options */}
                  </div>
                </div>
              </div>

              {/* Audit Information */}
              <div className="space-y-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Audit Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span> {' '}
                    {new Date(originalUser.createdAt).toLocaleString()}
                  </div>
                  {originalUser.updatedAt && (
                    <div>
                      <span className="font-medium">Last Updated:</span> {' '}
                      {new Date(originalUser.updatedAt).toLocaleString()}
                    </div>
                  )}
                  {originalUser.lastLoginAt && (
                    <div>
                      <span className="font-medium">Last Login:</span> {' '}
                      {new Date(originalUser.lastLoginAt).toLocaleString()}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">User ID:</span> {originalUser.id}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  disabled={loading || !hasChanges()}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update User</span>
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

export default EditUser;
