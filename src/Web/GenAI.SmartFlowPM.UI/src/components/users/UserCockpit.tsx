'use client';

import React, { useState, useEffect } from 'react';
import { UserDto, PaginatedResponse } from '@/types/api.types';
import { userService } from '@/services/user.service';
import { useToast } from '@/contexts/ToastContext';
import ConfirmationModal, { useConfirmationModal } from '@/components/common/ConfirmationModal';
import CustomSelect from '@/components/common/CustomSelect';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus,
  PlusCircle,
  User,
  Users,
  Mail,
  Phone,
  Calendar,
  Eye,
  Loader2,
  MoreHorizontal,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Crown,
  UserCheck
} from 'lucide-react';
import { Pagination } from '@/components/common/Pagination';

interface UserCockpitProps {
  onNewUser?: () => void;
  onEditUser?: (user: UserDto) => void;
  onViewUser?: (user: UserDto) => void;
  onBackClick?: () => void;
}

// Individual User Card Component
interface UserCardProps {
  user: UserDto;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onView, onDelete, onToggleStatus }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Card Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-primary-100 rounded-md">
              <User className="w-5 h-5 text-primary-700 font-semibold" />
            </div>
            <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {user.firstName} {user.lastName}
            </span>
          </div>
          {user.hasReportee && (
            <div title="Manager" className="p-1 bg-yellow-100 rounded-md">
              <Crown className="w-5 h-5 text-yellow-600" />
            </div>
          )}
        </div>
        
        {/* Action Icons in Header */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onView}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all duration-200"
            title="View User"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all duration-200"
            title="Edit User"
          >
            <Edit className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    onToggleStatus();
                    setShowDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center ${
                    user.isActive 
                      ? 'text-orange-600' 
                      : 'text-green-600'
                  }`}
                >
                  {user.isActive ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Disable
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Enable
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center border-t border-gray-100"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* User Name */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">User Name:</span>
            <span className="text-gray-900 font-medium">{user.userName}</span>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Group:</span>
            <span className="text-gray-900">{user.hasReportee ? 'Managers' : 'Employees'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Client:</span>
            <span className="text-gray-900">Company A</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Role:</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {role}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-xs">No roles assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Mail className="w-4 h-4 mr-2" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phoneNumber && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              <span>{user.phoneNumber}</span>
            </div>
          )}
        </div>

        {/* Status and Trust Level */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Status:</span>
            <div className={`flex items-center space-x-1 ${getStatusColor(user.isActive)}`}>
              {getStatusIcon(user.isActive)}
              <span className="text-sm font-medium">
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-primary-600 font-medium">Internal</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>Created {formatDate(user.createdAt)}</span>
          </div>
          {user.lastLoginAt && (
            <span>Modified {formatDate(user.lastLoginAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const UserCockpit: React.FC<UserCockpitProps> = ({
  onNewUser,
  onEditUser,
  onViewUser,
  onBackClick
}) => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [filterManager, setFilterManager] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12; // Show 12 cards at a time
  const { error: showError, success: showSuccess } = useToast();
  const { showConfirmation, confirmationModal } = useConfirmationModal();

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, filterActive, filterManager]);

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, filterActive, filterManager]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Use proper pagination with the current page and filters
      let response: PaginatedResponse<UserDto>;
      
      if (searchTerm) {
        // If searching, get all users and filter client-side for now
        // In a real app, you'd want server-side search
        const allUsers = await userService.getUsers(1, 1000);
        const filteredUsers = allUsers.filter(user => 
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Apply additional filters
        let finalFilteredUsers = filteredUsers;
        if (filterActive !== null) {
          finalFilteredUsers = finalFilteredUsers.filter(user => user.isActive === filterActive);
        }
        if (filterManager !== null) {
          finalFilteredUsers = finalFilteredUsers.filter(user => user.hasReportee === filterManager);
        }
        
        // Create mock pagination response for filtered results
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUsers = finalFilteredUsers.slice(startIndex, endIndex);
        
        setUsers(paginatedUsers);
        setTotalPages(Math.ceil(finalFilteredUsers.length / pageSize));
        setTotalCount(finalFilteredUsers.length);
      } else {
        // Use proper pagination when not searching
        response = await userService.getUsersPaginated(currentPage, pageSize);
        
        let filteredUsers = response.items;
        
        // Apply filters client-side for now
        if (filterActive !== null) {
          filteredUsers = filteredUsers.filter(user => user.isActive === filterActive);
        }
        if (filterManager !== null) {
          filteredUsers = filteredUsers.filter(user => user.hasReportee === filterManager);
        }
        
        setUsers(filteredUsers);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      }
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to load users. Please try again.';
      showError('Load Users Failed', errorMessage);
      
      // Set empty state on error
      setUsers([]);
      setTotalPages(0);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: UserDto) => {
    showConfirmation({
      title: 'Delete User',
      message: `Are you sure you want to delete the user "${user.firstName} ${user.lastName}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await userService.deleteUser(user.id);
          showSuccess('User Deleted', 'User has been successfully deleted.');
          loadUsers();
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || 
                              error?.message || 
                              'Failed to delete user. Please try again.';
          showError('Delete Failed', errorMessage);
        }
      }
    });
  };

  const handleToggleStatus = async (user: UserDto) => {
    try {
      await userService.toggleUserStatus(user.id, !user.isActive);
      const statusText = !user.isActive ? 'activated' : 'deactivated';
      showSuccess('Status Updated', `User has been successfully ${statusText}.`);
      loadUsers();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to update user status. Please try again.';
      showError('Status Update Failed', errorMessage);
    }
  };

  const handleExport = async () => {
    try {
      // Get all users for export
      const allUsers = await userService.getUsers(1, 1000);
      
      const csvContent = [
        ['Name', 'Email', 'Username', 'Phone', 'Status', 'Manager', 'Created At'].join(','),
        ...allUsers.map((user: UserDto) => [
          `"${user.firstName} ${user.lastName}"`,
          user.email,
          user.userName,
          user.phoneNumber || '',
          user.isActive ? 'Active' : 'Inactive',
          user.hasReportee ? 'Yes' : 'No',
          new Date(user.createdAt).toLocaleDateString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      showSuccess('Export Successful', 'Users have been exported successfully.');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to export users. Please try again.';
      showError('Export Failed', errorMessage);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterActive(null);
    setFilterManager(null);
    setCurrentPage(1);
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex-none">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-xl shadow-lg">
                <Users className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Cockpit</h1>
                <p className="text-sm text-gray-600">Manage and monitor user approvals</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button> 
            
            <button
              onClick={onNewUser}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New User</span>
            </button>

            <button
              onClick={onBackClick}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Box */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">Filters</span>
              </div>
              
              <CustomSelect
                value={filterActive === null ? '' : filterActive.toString()}
                onChange={(value) => setFilterActive(value === '' ? null : value === 'true')}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' }
                ]}
                className="w-32"
                placeholder="All Status"
              />

              <CustomSelect
                value={filterManager === null ? '' : filterManager.toString()}
                onChange={(value) => setFilterManager(value === '' ? null : value === 'true')}
                options={[
                  { value: '', label: 'All Users' },
                  { value: 'true', label: 'Managers' },
                  { value: 'false', label: 'Non-Managers' }
                ]}
                className="w-36"
                placeholder="All Users"
              />

              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {users.length} of {totalCount} users
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>
      </div>

      {/* Content Area - Full width, no extra padding */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto p-4 pb-20">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-primary-500" />
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-300 w-12 h-12 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No users match "${searchTerm}"` : 'Get started by creating your first user.'}
              </p>
              {onNewUser && (
                <button 
                  onClick={onNewUser} 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create New User
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {users.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onView={() => onViewUser?.(user)}
                  onEdit={() => onEditUser?.(user)}
                  onDelete={() => handleDeleteUser(user)}
                  onToggleStatus={() => handleToggleStatus(user)}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          itemName="users"
          onPageChange={setCurrentPage}
          loading={loading}
        />
      </div>

      {/* Confirmation Modal */}
      {confirmationModal}
    </div>
  );
};

export default UserCockpit;
