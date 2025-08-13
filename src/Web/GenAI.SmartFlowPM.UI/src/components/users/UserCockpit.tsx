'use client';

import React, { useState, useEffect } from 'react';
import { UserDto } from '@/types/api.types';
import { userService } from '@/services/user.service';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus,
  User,
  Users,
  Mail,
  Phone,
  Calendar,
  Eye,
  Loader,
  MoreHorizontal,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Crown,
  UserCheck
} from 'lucide-react';

interface UserCockpitProps {
  onNewUser?: () => void;
  onEditUser?: (user: UserDto) => void;
  onBackClick?: () => void;
}

// Individual User Card Component
interface UserCardProps {
  user: UserDto;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete, onToggleStatus }) => {
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
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {user.firstName} {user.lastName}
            </span>
          </div>
          {user.hasReportee && (
            <div title="Manager">
              <Crown className="w-4 h-4 text-yellow-500" />
            </div>
          )}
        </div>
        
        {/* Action Icons in Header */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit User"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleStatus}
            className={`p-1 transition-colors ${user.isActive ? 'text-gray-400 hover:text-orange-600' : 'text-gray-400 hover:text-green-600'}`}
            title={user.isActive ? 'Deactivate User' : 'Activate User'}
          >
            <Eye className="w-4 h-4" />
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
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    onDelete();
                    setShowDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
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
            <span className="text-gray-500">Plant:</span>
            <span className="text-gray-900">Company A</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Unit:</span>
            <span className="text-gray-900">user</span>
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
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-600 font-medium">Internal</span>
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
            <span>Updated {formatDate(user.updatedAt || user.createdAt)}</span>
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

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, filterActive, filterManager]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Use the userService method with proper pagination
      console.log('Calling userService.getUsers...');
      const allUsers = await userService.getUsers(1, 1000); // Get all users first
      console.log('Raw API response:', allUsers);
      
      // Ensure allUsers is an array
      if (!Array.isArray(allUsers)) {
        console.error('API response is not an array:', allUsers);
        
        // Try to handle different response formats
        if (allUsers && typeof allUsers === 'object') {
          const response = allUsers as any;
          // Check if it's a paginated response that wasn't properly extracted
          if ('data' in response && Array.isArray(response.data)) {
            console.log('Found data array in response:', response.data);
            setUsers(response.data.slice(0, pageSize));
            setTotalPages(Math.ceil(response.data.length / pageSize));
            setTotalCount(response.data.length);
            return;
          }
          // Check if it has items property
          if ('items' in response && Array.isArray(response.items)) {
            console.log('Found items array in response:', response.items);
            setUsers(response.items.slice(0, pageSize));
            setTotalPages(Math.ceil(response.items.length / pageSize));
            setTotalCount(response.items.length);
            return;
          }
        }
        
        // If we can't find an array, set empty results
        setUsers([]);
        setTotalPages(0);
        setTotalCount(0);
        return;
      }
      
      // Filter users based on search and filters
      let filteredUsers = allUsers;
      
      if (searchTerm) {
        filteredUsers = allUsers.filter(user => 
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (filterActive !== null) {
        filteredUsers = filteredUsers.filter(user => user.isActive === filterActive);
      }
      
      if (filterManager !== null) {
        filteredUsers = filteredUsers.filter(user => user.hasReportee === filterManager);
      }
      
      // Apply pagination to filtered results
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      setUsers(paginatedUsers);
      setTotalPages(Math.ceil(filteredUsers.length / pageSize));
      setTotalCount(filteredUsers.length);
      
    } catch (error) {
      console.error('Error loading users:', error);
      // Set empty state on error instead of showing alert
      setUsers([]);
      setTotalPages(0);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      alert('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleToggleStatus = async (user: UserDto) => {
    try {
      await userService.toggleUserStatus(user.id, !user.isActive);
      alert(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to update user status');
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
      
      alert('Users exported successfully');
    } catch (error) {
      console.error('Error exporting users:', error);
      alert('Failed to export users');
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
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
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button> 
            
            <button
              onClick={onNewUser}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>New User</span>
            </button>

            <button
              onClick={onBackClick}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">Filters</span>
              </div>
              
              <select
                value={filterActive === null ? '' : filterActive.toString()}
                onChange={(e) => setFilterActive(e.target.value === '' ? null : e.target.value === 'true')}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <select
                value={filterManager === null ? '' : filterManager.toString()}
                onChange={(e) => setFilterManager(e.target.value === '' ? null : e.target.value === 'true')}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Users</option>
                <option value="true">Managers</option>
                <option value="false">Non-Managers</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              <Loader className="animate-spin w-8 h-8 text-blue-500" />
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
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
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
                  onEdit={() => onEditUser?.(user)}
                  onDelete={() => handleDeleteUser(user.id)}
                  onToggleStatus={() => handleToggleStatus(user)}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Fixed Pagination - Always show if there are users */}
        {totalCount > 0 && (
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {Math.max(totalPages, 1)} ({totalCount} total users)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(Math.max(totalPages, 1), currentPage + 1))}
                  disabled={currentPage >= totalPages || totalPages <= 1}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserCockpit;
