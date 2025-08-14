'use client';

import React, { useState, useEffect } from 'react';
import { ClaimDto, PaginatedResponse } from '@/types/api.types';
import { claimService } from '@/services/claim.service';
import { useToast } from '@/contexts/ToastContext';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowLeft, 
  Edit, 
  Trash2,
  PlusCircle,
  Key,
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

interface ClaimCockpitProps {
  onBack?: () => void;
  onAddNew?: () => void;
  onEdit?: (claim: ClaimDto) => void;
  onView?: (claim: ClaimDto) => void;
}

interface ClaimCardProps {
  claim: ClaimDto;
  onEdit: (claim: ClaimDto) => void;
  onView: (claim: ClaimDto) => void;
  onDelete: (claim: ClaimDto) => void;
  onToggleStatus: (claim: ClaimDto) => void;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ 
  claim, 
  onEdit, 
  onView, 
  onDelete, 
  onToggleStatus 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'permission': 'bg-blue-100 text-blue-800',
      'feature': 'bg-green-100 text-green-800',
      'resource': 'bg-purple-100 text-purple-800',
      'action': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[type.toLowerCase() as keyof typeof colors] || colors.default;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-full overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="flex-none p-2 bg-blue-100 rounded-lg">
            <Key className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{claim.name}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(claim.type)}`}>
              {claim.type}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(claim);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(claim);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    {claim.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    <span>{claim.isActive ? 'Deactivate Claim' : 'Activate Claim'}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(claim);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Claim</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(claim);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Claim</span>
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
              {claim.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 ${getStatusColor(claim.isActive)}`}>
              {getStatusIcon(claim.isActive)}
              <span className="text-sm font-medium">
                {claim.isActive ? 'Active' : 'Inactive'}
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
          <span>Created {formatDate(claim.createdAt)}</span>
          {claim.updatedAt && (
            <>
              <span>•</span>
              <span>Updated {formatDate(claim.updatedAt)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const ClaimCockpit: React.FC<ClaimCockpitProps> = ({ 
  onBack, 
  onAddNew, 
  onEdit, 
  onView 
}) => {
  const [claims, setClaims] = useState<ClaimDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12; // Show 12 cards at a time
  const { success, error } = useToast();

  useEffect(() => {
    loadClaims();
  }, [currentPage, searchTerm, filterActive]);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<ClaimDto> = await claimService.getClaims(
        currentPage,
        pageSize,
        searchTerm
      );
      
      let filteredClaims = response.items || [];
      
      // Apply status filter
      if (filterActive !== null) {
        filteredClaims = filteredClaims.filter(claim => claim.isActive === filterActive);
      }
      
      setClaims(filteredClaims);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error loading claims:', err);
      error('Error', 'Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClaim = async (claim: ClaimDto) => {
    if (!confirm(`Are you sure you want to delete the claim "${claim.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await claimService.deleteClaim(claim.id);
      success('Claim Deleted', `Claim "${claim.name}" has been successfully deleted.`);
      loadClaims();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to delete claim. Please try again.';
      error('Delete Failed', errorMessage);
    }
  };

  const handleToggleStatus = async (claim: ClaimDto) => {
    try {
      await claimService.toggleClaimStatus(claim.id, !claim.isActive);
      const statusText = !claim.isActive ? 'activated' : 'deactivated';
      success('Status Updated', `Claim has been successfully ${statusText}.`);
      loadClaims();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to update claim status. Please try again.';
      error('Status Update Failed', errorMessage);
    }
  };

  const handleExport = async () => {
    try {
      // Get all claims for export
      const allClaims = await claimService.getAllClaims();
      
      const csvContent = [
        ['Name', 'Type', 'Description', 'Status', 'Created At', 'Updated At'].join(','),
        ...allClaims.map(claim => [
          `"${claim.name}"`,
          `"${claim.type}"`,
          `"${claim.description || ''}"`,
          claim.isActive ? 'Active' : 'Inactive',
          new Date(claim.createdAt).toLocaleDateString(),
          claim.updatedAt ? new Date(claim.updatedAt).toLocaleDateString() : ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `claims-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      success('Export Successful', 'Claims data has been exported successfully.');
    } catch (err) {
      console.error('Error exporting claims:', err);
      error('Export Failed', 'Failed to export claims data.');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterActive(null);
    setCurrentPage(1);
  };

  const handleEdit = (claim: ClaimDto) => {
    if (onEdit) {
      onEdit(claim);
    } else {
      console.log('Edit claim:', claim);
    }
  };

  const handleView = (claim: ClaimDto) => {
    if (onView) {
      onView(claim);
    } else {
      console.log('View claim:', claim);
    }
  };

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew();
    } else {
      console.log('Add new claim');
    }
  };

  return (
    <div className="h-full w-full max-w-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex-none bg-white border-b border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex-none p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="flex items-center space-x-3 min-w-0">
                <div className="flex-none p-2 bg-blue-100 rounded-lg">
                  <Key className="w-8 h-8 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-3xl font-bold text-gray-900">Claims Management</h1>
                  <p className="text-gray-600">Manage system claims and permissions</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 flex-none">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                disabled={loading}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Claim</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search claims by name, type, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterActive === null ? 'all' : filterActive.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilterActive(value === 'all' ? null : value === 'true');
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={loading}
                >
                  <option value="all">All Status</option>
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                </select>
              </div>

              {(searchTerm || filterActive !== null) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                  disabled={loading}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-6 max-w-full">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                <span className="ml-2 text-gray-600">Loading claims...</span>
              </div>
            ) : claims.length === 0 ? (
              <div className="text-center py-12">
                <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterActive !== null ? 'No claims found' : 'No claims created yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterActive !== null 
                    ? 'Try adjusting your search criteria or filters.' 
                    : 'Get started by creating your first claim.'
                  }
                </p>
                {(!searchTerm && filterActive === null) && (
                  <button
                    onClick={handleAddNew}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mx-auto"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add First Claim</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Claims Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {claims.map((claim) => (
                    <ClaimCard
                      key={claim.id}
                      claim={claim}
                      onEdit={handleEdit}
                      onView={handleView}
                      onDelete={handleDeleteClaim}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, totalCount)}
                      </span>{' '}
                      of <span className="font-medium">{totalCount}</span> claims
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === pageNum
                                  ? 'bg-primary-600 text-white'
                                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                              disabled={loading}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimCockpit;
