'use client';

import React, { useState, useEffect } from 'react';
import { RoleDto, PaginatedResponse } from '@/types/api.types';
import { roleService } from '@/services/role.service';
import { useToast } from '@/contexts/ToastContext';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowLeft, 
  Edit, 
  Trash2,
  PlusCircle,
  Shield,
  Users,
  Calendar,
  Clock,
  Eye,
  Loader2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';

interface RoleCockpitProps {
  onNewRole?: () => void;
  onEditRole?: (role: RoleDto) => void;
  onViewRole?: (role: RoleDto) => void;
  onBackClick?: () => void;
}

// Individual Role Card Component
interface RoleCardProps {
  role: RoleDto;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onView, onDelete, onToggleStatus }) => {
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
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {role.name}
            </span>
          </div>
        </div>
        
        {/* Action Icons in Header */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onView}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Role"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit Role"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="More Actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    onToggleStatus();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  {role.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  <span>{role.isActive ? 'Deactivate' : 'Activate'} Role</span>
                </button>
                
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      onDelete();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Role</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Description */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-gray-900 break-words">
              {role.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 ${getStatusColor(role.isActive)}`}>
              {getStatusIcon(role.isActive)}
              <span className="text-sm font-medium">
                {role.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>Created {formatDate(role.createdAt)}</span>
          {role.updatedAt && (
            <>
              <span>•</span>
              <span>Updated {formatDate(role.updatedAt)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Main RoleCockpit Component
export const RoleCockpit: React.FC<RoleCockpitProps> = ({
  onNewRole,
  onEditRole,
  onViewRole,
  onBackClick
}) => {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const { success, error } = useToast();

  const pageSize = 12; // Optimal for card grid display

  // Load roles data
  useEffect(() => {
    loadRoles();
  }, [currentPage, searchTerm, filterActive]);

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, filterActive]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      
      if (searchTerm || filterActive !== null) {
        // If searching or filtering, get all roles and filter client-side for now
        const allRoles = await roleService.getAllRoles();
        
        const filteredRoles = allRoles.filter(role => 
          (!searchTerm || 
           role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        );

        // Apply additional filters
        let finalFilteredRoles = filteredRoles;
        if (filterActive !== null) {
          finalFilteredRoles = finalFilteredRoles.filter(role => role.isActive === filterActive);
        }

        // Apply pagination to filtered results
        const startIndex = (currentPage - 1) * pageSize;
        const paginatedRoles = finalFilteredRoles.slice(startIndex, startIndex + pageSize);
        
        setRoles(paginatedRoles);
        setTotalCount(finalFilteredRoles.length);
        setTotalPages(Math.ceil(finalFilteredRoles.length / pageSize));
      } else {
        // Use proper pagination with the current page and filters
        const result = await roleService.getRoles(currentPage, pageSize, searchTerm);
        setRoles(result.items);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
      }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 
                            error?.message || 
                            'Failed to load roles. Please try again.';
        error('Loading Failed', errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    const handleDeleteRole = async (role: RoleDto) => {
      if (!confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`)) {
        return;
      }
  
      try {
        await roleService.deleteRole(role.id);
        success('Role Deleted', `Role "${role.name}" has been successfully deleted.`);
        loadRoles();
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 
                            error?.message || 
                            'Failed to delete role. Please try again.';
        error('Delete Failed', errorMessage);
      }
    };
  
    const handleToggleStatus = async (role: RoleDto) => {
      try {
        await roleService.toggleRoleStatus(role.id, !role.isActive);
        const statusText = !role.isActive ? 'activated' : 'deactivated';
        success('Status Updated', `Role has been successfully ${statusText}.`);
        loadRoles();
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 
                            error?.message || 
                            'Failed to update role status. Please try again.';
        error('Status Update Failed', errorMessage);
      }
    };  const handleExport = async () => {
    try {
      // Get all roles for export
      const allRoles = await roleService.getAllRoles();
      
      const csvContent = [
        ['Name', 'Description', 'Status', 'Created At', 'Updated At'].join(','),
        ...allRoles.map((role: RoleDto) => [
          `"${role.name}"`,
          `"${role.description || ''}"`,
          role.isActive ? 'Active' : 'Inactive',
          new Date(role.createdAt).toLocaleDateString(),
          role.updatedAt ? new Date(role.updatedAt).toLocaleDateString() : ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roles_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      success('Export Successful', 'Roles have been exported successfully.');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to export roles. Please try again.';
      error('Export Failed', errorMessage);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterActive(null);
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
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
                <p className="text-sm text-gray-600">Manage system roles and permissions</p>
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
              onClick={onNewRole}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Role</span>
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
                  placeholder="Search roles..."
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
                className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
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
              Showing {roles.length} of {totalCount} roles
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>
      </div>

      {/* Content Area - Full width, no extra padding */}
      <div className="flex-1 overflow-hidden relative">
        {loading ? (
          // Loading State
          <div className="h-full overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : roles.length === 0 ? (
          // Empty State
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterActive !== null ? 'No roles found' : 'No roles created yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterActive !== null 
                  ? 'Try adjusting your search criteria or filters.' 
                  : 'Get started by creating your first system role.'
                }
              </p>
              {(!searchTerm && filterActive === null) && (
                <button
                  onClick={onNewRole}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Role</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          // Roles Grid
          <div className="h-full overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {roles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={() => onEditRole?.(role)}
                  onView={() => onViewRole?.(role)}
                  onDelete={() => handleDeleteRole(role)}
                  onToggleStatus={() => handleToggleStatus(role)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 mt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            currentPage === pageNum
                              ? 'text-white bg-blue-600 border-blue-600'
                              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="px-2 py-2 text-sm text-gray-500">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
