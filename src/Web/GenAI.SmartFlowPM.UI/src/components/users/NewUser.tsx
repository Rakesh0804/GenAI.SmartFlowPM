'use client';

import React, { useState, useEffect } from 'react';
import { CreateUserDto, RoleDto, UserDto } from '@/types/api.types';
import { userService } from '@/services/user.service';
import { roleService } from '@/services/role.service';
import { useToast } from '@/contexts/ToastContext';
import { useApiWithToast } from '@/hooks/useApiWithToast';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  UserPlus,
  Users,
  Shield,
  Loader2,
  ChevronDown
} from 'lucide-react';

interface NewUserProps {
  onUserCreated?: () => void;
  onCancel?: () => void;
  onBack?: () => void;
}

export const NewUser: React.FC<NewUserProps> = ({
  onUserCreated,
  onCancel,
  onBack
}) => {
  const { success, error } = useToast();
  const { createUserWithToast } = useApiWithToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<RoleDto[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserDto[]>([]);
  const [managerSearchTerm, setManagerSearchTerm] = useState('');
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [selectedManager, setSelectedManager] = useState<UserDto | null>(null);
  const [formData, setFormData] = useState<CreateUserDto & { confirmPassword: string }>({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    managerId: undefined,
    hasReportee: false,
    roleIds: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAvailableRoles();
    loadAvailableUsers();
  }, []);

  const loadAvailableRoles = async () => {
    try {
      const roles = await roleService.getAllRoles();
      setAvailableRoles(roles);
    } catch (err: any) {
      console.error('Error loading roles:', err);
      
      // Extract proper error message
      let errorMessage = 'Failed to load roles';
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMessage = err.response.data.errors.join(', ');
      } else if (err?.message && !err.message.includes('status code')) {
        errorMessage = err.message;
      }
      
      error('Error Loading Roles', errorMessage);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const users = await userService.getUsers(1, 100); // Reduced from 1000 to 100 (backend limit)
      setAvailableUsers(users);
    } catch (err: any) {
      console.error('Error loading users:', err);
      
      // Extract proper error message
      let errorMessage = 'Failed to load users';
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMessage = err.response.data.errors.join(', ');
      } else if (err?.message && !err.message.includes('status code')) {
        errorMessage = err.message;
      }
      
      error('Error Loading Users', errorMessage);
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

  const handleManagerSearch = (searchTerm: string) => {
    setManagerSearchTerm(searchTerm);
    setShowManagerDropdown(true);
  };

  const handleManagerSelect = (manager: UserDto) => {
    setSelectedManager(manager);
    setManagerSearchTerm(`${manager.firstName} ${manager.lastName}`);
    setShowManagerDropdown(false);
    setFormData(prev => ({
      ...prev,
      managerId: manager.id
    }));
  };

  const filteredManagers = availableUsers.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(managerSearchTerm.toLowerCase())
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Username must be at least 3 characters long';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
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
      const { confirmPassword, ...userData } = formData;
      // Clean up optional fields - remove empty strings and convert to undefined/null
      const cleanedUserData = {
        ...userData,
        phoneNumber: userData.phoneNumber?.trim() || undefined,
        managerId: userData.managerId || undefined
      };
      
      await createUserWithToast(cleanedUserData);
      
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (err) {
      // Error handling is already done in createUserWithToast
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
                <UserPlus className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
                <p className="text-sm text-gray-600">Add a new user to the system</p>
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
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                        value={formData.userName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                      Manager
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="managerId"
                        name="managerId"
                        value={managerSearchTerm}
                        onChange={(e) => handleManagerSearch(e.target.value)}
                        onFocus={() => setShowManagerDropdown(true)}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Search for a manager (optional)"
                        disabled={loading}
                        autoComplete="off"
                      />
                      {managerSearchTerm ? (
                        <button
                          type="button"
                          onClick={() => {
                            setManagerSearchTerm('');
                            setSelectedManager(null);
                            setFormData(prev => ({ ...prev, managerId: undefined }));
                            setShowManagerDropdown(false);
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-4 h-4"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : (
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      )}
                      
                      {/* Manager Dropdown */}
                      {showManagerDropdown && managerSearchTerm && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredManagers.length > 0 ? (
                            filteredManagers.map((user) => (
                              <div
                                key={user.id}
                                onClick={() => handleManagerSelect(user)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                              >
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-600">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">No managers found</div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.managerId && (
                      <p className="text-sm text-red-600">{errors.managerId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Security Information</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Enter password"
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Confirm password"
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="hasReportee"
                        name="hasReportee"
                        checked={formData.hasReportee}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2"
                        disabled={loading}
                      />
                      <label htmlFor="hasReportee" className="flex items-center text-sm font-medium text-gray-700">
                        <Users className="w-5 h-5 mr-2 text-accent" />
                        Manager Role
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 ml-8">
                      Check if user manages other team members
                    </p>
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
                          className={`relative rounded-lg border-2 cursor-pointer transition-colors p-4 ${
                            selectedRoleIds.includes(role.id)
                              ? 'border-blue-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleRoleToggle(role.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                checked={selectedRoleIds.includes(role.id)}
                                onChange={() => handleRoleToggle(role.id)}
                                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
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
                      <span>Create User</span>
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

export default NewUser;
