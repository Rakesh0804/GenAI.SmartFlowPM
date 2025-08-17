'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/user.service';
import { useToast } from '@/contexts/ToastContext';
import { CustomSelect } from '@/components/common/CustomSelect';
import {
  User,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  Building,
  Camera,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  Loader2,
  UserCheck,
  CheckCircle
} from 'lucide-react';

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserProfileProps {
  onBackClick: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onBackClick }) => {
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    userName: user?.userName || ''
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<UserProfileData & PasswordData>>({});

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        userName: user.userName || ''
      });
    }
  }, [user]);

  const validateProfile = (): boolean => {
    const newErrors: Partial<UserProfileData> = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!profileData.userName.trim()) {
      newErrors.userName = 'Username is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: Partial<PasswordData> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveProfile = async () => {
    if (!validateProfile() || !user) return;

    setIsLoading(true);
    try {
      await userService.updateUser(user.id, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        userName: profileData.userName,
        hasReportee: user.hasReportee
      });

      await refreshUser();
      setIsEditing(false);
      showSuccess('Profile Updated', 'Your profile has been successfully updated.');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Failed to update profile. Please try again.';
      showError('Update Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      // Change password using the user service
      await userService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      showSuccess('Password Changed', 'Your password has been successfully updated.');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Failed to change password. Please try again.';
      showError('Password Change Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isChangingPassword) {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setIsEditing(false);
      if (user) {
        setProfileData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          userName: user.userName || ''
        });
      }
    }
    setErrors({});
  };

  const getUserInitials = () => {
    if (!user) return 'UN';
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'UN';
  };

  const getDisplayName = () => {
    if (!user) return 'Unknown User';
    return user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.email || 'Unknown User';
  };

  if (authLoading || !user) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
          <p className="text-gray-600">{authLoading ? 'Loading profile...' : 'No user data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackClick}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary-100 rounded-xl shadow-lg">
                  <User className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                  <p className="text-sm text-gray-600">Manage your personal information and settings</p>
                </div>
              </div>
            </div>
            
            {!isEditing && !isChangingPassword && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <Lock className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center ring-4 ring-white shadow-lg">
                    <span className="text-3xl font-bold text-primary-700">
                      {getUserInitials()}
                    </span>
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors duration-200 shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h2 className="mt-4 text-xl font-bold text-gray-900">{getDisplayName()}</h2>
                <p className="text-gray-600">@{user.userName}</p>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-600">
                      {user.isActive ? 'Active Account' : 'Inactive Account'}
                    </span>
                  </div>
                  
                  {user.lastLoginAt && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roles Section */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary-600" />
                Roles & Permissions
              </h3>
              
              <div className="space-y-2">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-primary-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium text-primary-800">{role}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No roles assigned</p>
                )}
              </div>
              
              {user.hasReportee && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Manager Role</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">You have team members reporting to you</p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2">
            
            {/* Profile Information */}
            {!isChangingPassword && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                  {isEditing && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          id="profile-first-name"
                          name="firstName"
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          autoComplete="given-name"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                            errors.firstName ? 'border-red-500 ring-red-200' : ''
                          }`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.firstName || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          id="profile-last-name"
                          name="lastName"
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          autoComplete="family-name"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                            errors.lastName ? 'border-red-500 ring-red-200' : ''
                          }`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.lastName || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          id="profile-username"
                          name="username"
                          type="text"
                          value={profileData.userName}
                          onChange={(e) => handleInputChange('userName', e.target.value)}
                          autoComplete="username"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                            errors.userName ? 'border-red-500 ring-red-200' : ''
                          }`}
                          placeholder="Enter your username"
                        />
                        {errors.userName && (
                          <p className="text-sm text-red-600 mt-1">{errors.userName}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 py-2">@{profileData.userName || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          id="profile-email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          autoComplete="email"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                            errors.email ? 'border-red-500 ring-red-200' : ''
                          }`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.email || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          id="profile-phone"
                          name="phoneNumber"
                          type="tel"
                          value={profileData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          autoComplete="tel"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                            errors.phoneNumber ? 'border-red-500 ring-red-200' : ''
                          }`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phoneNumber && (
                          <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.phoneNumber || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Change Password Section */}
            {isChangingPassword && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      <span>{isLoading ? 'Changing...' : 'Change Password'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="current-password"
                        name="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        autoComplete="current-password"
                        className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                          errors.currentPassword ? 'border-red-500 ring-red-200' : ''
                        }`}
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
                        name="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        autoComplete="new-password"
                        className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                          errors.newPassword ? 'border-red-500 ring-red-200' : ''
                        }`}
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        autoComplete="new-password"
                        className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                          errors.confirmPassword ? 'border-red-500 ring-red-200' : ''
                        }`}
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Password Requirements:</strong>
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• At least 6 characters long</li>
                      <li>• Must be different from your current password</li>
                      <li>• Should include a mix of letters, numbers, and symbols</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            {!isChangingPassword && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Account Status</label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className={`text-sm font-medium ${user.isActive ? 'text-green-700' : 'text-gray-600'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>

                  {user.lastLoginAt && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Last Login</label>
                      <p className="text-gray-900">{new Date(user.lastLoginAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default UserProfile;
