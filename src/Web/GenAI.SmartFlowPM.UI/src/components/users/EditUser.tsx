'use client';

import React, { useState, useEffect } from 'react';
import { UserDto, UpdateUserDto, RoleDto } from '@/types/api.types';
import { userService } from '@/services/user.service';
import { roleService } from '@/services/role.service';
import { useToast } from '@/contexts/ToastContext';
import { 
  User, 
  Mail, 
  Phone, 
  Save, 
  X, 
  Edit,
  Eye,
  Users,
  Loader,
  Shield,
  ChevronDown,
  Loader2
} from 'lucide-react';

interface EditUserProps {
  userId: string;
  onUserUpdated?: () => void;
  onCancel?: () => void;
  onBack?: () => void;
  readOnly?: boolean;
}

export const EditUser: React.FC<EditUserProps> = ({
  userId,
  onUserUpdated,
  onCancel,
  onBack,
  readOnly = false
}) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [originalUser, setOriginalUser] = useState<UserDto | null>(null);
  const [availableRoles, setAvailableRoles] = useState<RoleDto[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  
  // Manager autocomplete states
  const [availableUsers, setAvailableUsers] = useState<UserDto[]>([]);
  const [managerSearchTerm, setManagerSearchTerm] = useState('');
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [selectedManager, setSelectedManager] = useState<UserDto | null>(null);
  const [formData, setFormData] = useState<UpdateUserDto>({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    phoneNumber: '',
    managerId: '',
    hasReportee: false,
    isActive: true,
    roleIds: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAvailableRoles();
    // Load users for manager autocomplete only if not in readOnly mode
    if (!readOnly) {
      loadAvailableUsers();
    }
  }, [readOnly]);

  useEffect(() => {
    if (availableRoles.length > 0) {
      loadUser();
    }
  }, [userId, availableRoles]);

  // Set up manager when availableUsers loads
  useEffect(() => {
    if (originalUser && originalUser.managerId && availableUsers.length > 0) {
      const manager = availableUsers.find(u => u.id === originalUser.managerId);
      if (manager) {
        setSelectedManager(manager);
        setManagerSearchTerm(`${manager.firstName} ${manager.lastName}`);
      }
    }
  }, [availableUsers, originalUser]);

  const loadAvailableRoles = async () => {
    try {
      const roles = await roleService.getAllRoles();
      setAvailableRoles(roles);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const users = await userService.getUsers(1, 1000);
      setAvailableUsers(users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadUser = async () => {
    try {
      setInitialLoading(true);
      const user = await userService.getUserById(userId);
      setOriginalUser(user);
      
      // Extract role names from user roles and map to role IDs
      const userRoleNames = user.roles || [];
      const matchingRoleIds = availableRoles
        .filter(role => userRoleNames.includes(role.name))
        .map(role => role.id);
      
      setSelectedRoleIds(matchingRoleIds);
      
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userName: user.userName,
        phoneNumber: user.phoneNumber || '',
        managerId: user.managerId || '',
        hasReportee: user.hasReportee,
        isActive: user.isActive,
        roleIds: matchingRoleIds
      });

      // Set manager autocomplete if user has a manager
      if (user.managerId) {
        if (readOnly) {
          // In read-only mode, fetch the manager details
          fetchManagerForReadOnly(user.managerId);
        } else if (availableUsers.length > 0) {
          // Edit mode with availableUsers loaded
          const manager = availableUsers.find(u => u.id === user.managerId);
          if (manager) {
            setSelectedManager(manager);
            setManagerSearchTerm(`${manager.firstName} ${manager.lastName}`);
          }
        } else {
          // Edit mode but availableUsers not loaded yet
          setManagerSearchTerm('Loading...');
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      alert('Failed to load user details');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchManagerForReadOnly = async (managerId: string) => {
    try {
      const manager = await userService.getUserById(managerId);
      setSelectedManager(manager);
      setManagerSearchTerm(`${manager.firstName} ${manager.lastName}`);
    } catch (error) {
      console.error('Error loading manager details:', error);
      // Set fallback text if manager fetch fails
      setManagerSearchTerm('Manager information unavailable');
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

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoleIds(prev => {
      const newSelectedRoles = prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId];
      
      // Update form data with selected role IDs
      setFormData(prevForm => ({
        ...prevForm,
        roleIds: newSelectedRoles
      }));
      
      return newSelectedRoles;
    });
  };

  // Manager autocomplete handlers
  const handleManagerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManagerSearchTerm(value);
    setShowManagerDropdown(true);
    
    if (!value) {
      setSelectedManager(null);
      setFormData(prev => ({ ...prev, managerId: '' }));
    }
  };

  const handleManagerSelect = (user: UserDto) => {
    setSelectedManager(user);
    setManagerSearchTerm(`${user.firstName} ${user.lastName}`);
    setFormData(prev => ({ ...prev, managerId: user.id }));
    setShowManagerDropdown(false);
  };

  const filteredManagers = availableUsers.filter(user =>
    user.id !== userId && // Don't show self
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(managerSearchTerm.toLowerCase())
  );

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
      error('No changes to save');
      return;
    }

    try {
      setLoading(true);
      
      await userService.updateUser(userId, formData);
      success('User updated successfully!');
      
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (err: any) {
      console.error('Error updating user:', err);
      
      // Handle specific API errors
      if (err.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        err.response.data.errors.forEach((errorMsg: string) => {
          if (errorMsg.includes('email')) {
            apiErrors.email = 'Email address is already in use';
          } else if (errorMsg.includes('username')) {
            apiErrors.userName = 'Username is already taken';
          } else {
            error(`Error: ${errorMsg}`);
          }
        });
        setErrors(prev => ({ ...prev, ...apiErrors }));
      } else {
        error('Failed to update user. Please try again.');
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
          <Loader className="animate-spin w-8 h-8 text-primary-600" />
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
              <div className="p-2 bg-primary-100 rounded-lg">
                {readOnly ? (
                  <Eye className="w-6 h-6 text-primary-600" />
                ) : (
                  <Edit className="w-6 h-6 text-primary-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {readOnly ? 'View User' : 'Edit User'}
                </h1>
                <p className="text-sm text-gray-600">
                  {readOnly ? 'Viewing details for' : 'Update details for'} {originalUser.firstName} {originalUser.lastName}
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Enter first name"
                        disabled={loading || readOnly}
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Enter last name"
                        disabled={loading || readOnly}
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Enter email address"
                        disabled={loading || readOnly}
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Enter phone number"
                        disabled={loading || readOnly}
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Enter username"
                        disabled={loading || readOnly}
                        required
                      />
                    </div>
                    {errors.userName && (
                      <p className="text-sm text-red-600">{errors.userName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">
                      Manager
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                      {readOnly ? (
                        // Read-only view: Show manager information
                        <div className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                          {selectedManager ? (
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-600">
                                  {selectedManager.firstName?.charAt(0)}{selectedManager.lastName?.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  {selectedManager.firstName} {selectedManager.lastName}
                                </div>
                                <div className="text-xs text-gray-500">{selectedManager.email}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">No manager assigned</span>
                          )}
                        </div>
                      ) : (
                        // Edit mode: Show autocomplete input
                        <>
                          <input
                            type="text"
                            id="managerId"
                            value={managerSearchTerm}
                            onChange={handleManagerSearch}
                            onFocus={() => setShowManagerDropdown(true)}
                            onBlur={() => setTimeout(() => setShowManagerDropdown(false), 200)}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            placeholder="Search for a manager (optional)"
                            disabled={loading}
                          />
                          {managerSearchTerm ? (
                            <button
                              type="button"
                              onClick={() => {
                                setManagerSearchTerm('');
                                setSelectedManager(null);
                                setFormData(prev => ({ ...prev, managerId: '' }));
                                setShowManagerDropdown(false);
                              }}
                              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              disabled={loading}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          ) : (
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          )}
                          
                          {showManagerDropdown && filteredManagers.length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                              {filteredManagers.map((user) => (
                                <div
                                  key={user.id}
                                  onClick={() => handleManagerSelect(user)}
                                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                      <span className="text-sm font-medium text-primary-600">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                      </div>
                                      <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
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
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        disabled={loading || readOnly}
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
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        disabled={loading || readOnly}
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

              {/* Role Assignment */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Role Assignment</h3>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Select one or more roles for this user. Roles determine what actions the user can perform in the system.
                  </p>
                  
                  {availableRoles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableRoles.map((role) => (
                        <div
                          key={role.id}
                          className={`relative rounded-lg border-2 transition-colors p-4 ${
                            selectedRoleIds.includes(role.id)
                              ? 'border-blue-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                          onClick={() => !readOnly && handleRoleToggle(role.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                checked={selectedRoleIds.includes(role.id)}
                                onChange={() => !readOnly && handleRoleToggle(role.id)}
                                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <Shield className="w-4 h-4 text-primary-500" />
                                <h4 className="text-sm font-medium text-gray-900">{role.name}</h4>
                              </div>
                              {role.description && (
                                <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  role.isActive 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {role.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No roles available. Please contact your administrator.</p>
                    </div>
                  )}
                  
                  {selectedRoleIds.length > 0 && (
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-secondary-500 mb-2">Selected Roles:</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedRoleIds.map(roleId => {
                          const role = availableRoles.find(r => r.id === roleId);
                          return role ? (
                            <span
                              key={roleId}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {role.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
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
              {!readOnly ? (
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    disabled={loading || !hasChanges()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
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
              ) : (
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Close
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

export default EditUser;
