'use client';

import React, { useState, useEffect } from 'react';
import { OrganizationDto, BranchWithManagerDto, PaginatedResponse } from '@/types/api.types';
import { organizationService } from '@/services/organization.service';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/common/Pagination';
import { CustomSelect } from '@/components/common/CustomSelect';
import { useConfirmationModal } from '@/components/common/ConfirmationModal';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowLeft, 
  Edit, 
  Trash2,
  PlusCircle,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Eye,
  Loader2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Globe,
  Mail,
  Phone,
  Building
} from 'lucide-react';

interface OrganizationCockpitProps {
  onNewOrganization?: () => void;
  onEditOrganization?: (organization: OrganizationDto) => void;
  onViewOrganization?: (organization: OrganizationDto) => void;
  onBackClick?: () => void;
}

// Individual Organization Card Component
interface OrganizationCardProps {
  organization: OrganizationDto;
  branches: BranchWithManagerDto[];
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ 
  organization, 
  branches,
  onEdit, 
  onView, 
  onDelete, 
  onToggleStatus 
}) => {
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

  const displayBranches = branches.slice(0, 3);
  const remainingBranches = branches.length > 3 ? branches.length - 3 : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Card Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-primary-100 rounded-md">
              <Building2 className="w-5 h-5 text-primary-700 font-semibold" />
            </div>
            <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {organization.name}
            </span>
          </div>
        </div>
        
        {/* Action Icons in Header */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onView}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all duration-200"
            title="View Organization"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all duration-200"
            title="Edit Organization"
          >
            <Edit className="w-5 h-5" />
          </button>
          
          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
              title="More Actions"
            >
              <MoreHorizontal className="w-5 h-5" />
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
                  {organization.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  <span>{organization.isActive ? 'Deactivate' : 'Activate'} Organization</span>
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
                    <span>Delete Organization</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Organization Name */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Organization Name</p>
            <p className="text-sm text-gray-900 font-bold break-words">
              {organization.name}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-gray-900 break-words">
              {organization.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-2">
          {organization.website && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="w-3 h-3 flex-shrink-0 text-primary-500" />
              <span className="truncate">{organization.website}</span>
            </div>
          )}
          {organization.email && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-3 h-3 flex-shrink-0 text-green-500" />
              <span className="truncate">{organization.email}</span>
            </div>
          )}
          {organization.phone && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-3 h-3 flex-shrink-0 text-purple-500" />
              <span className="truncate">{organization.phone}</span>
            </div>
          )}
        </div>

        {/* Location */}
        {(organization.address || organization.city || organization.country) && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="p-1 bg-orange-100 rounded-md">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Location</p>
              <p className="text-sm text-gray-900 break-words">
                {[organization.address, organization.city, organization.state, organization.country]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Branches */}
        {branches.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Branches ({branches.length})</p>
            <div className="space-y-1">
              {displayBranches.map((branch) => (
                <div key={branch.id} className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="p-0.5 bg-orange-100 rounded">
                    <Building className="w-3 h-3 text-accent flex-shrink-0" />
                  </div>
                  <span className="truncate">
                    {branch.name} ({organizationService.getBranchTypeDisplay(branch.branchType)})
                  </span>
                </div>
              ))}
              {remainingBranches > 0 && (
                <div className="text-xs text-gray-500 ml-5">
                  +{remainingBranches} more branches
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 ${getStatusColor(organization.isActive)}`}>
              {getStatusIcon(organization.isActive)}
              <span className="text-sm font-medium">
                {organization.isActive ? 'Active' : 'Inactive'}
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
          <span>Created {formatDate(organization.createdAt)}</span>
          {organization.updatedAt && (
            <>
              <span>•</span>
              <span>Updated {formatDate(organization.updatedAt)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Main OrganizationCockpit Component
export const OrganizationCockpit: React.FC<OrganizationCockpitProps> = ({
  onNewOrganization,
  onEditOrganization,
  onViewOrganization,
  onBackClick
}) => {
  const [organizations, setOrganizations] = useState<OrganizationDto[]>([]);
  const [organizationBranches, setOrganizationBranches] = useState<Map<string, BranchWithManagerDto[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const { success, error: showError } = useToast();
  const { showConfirmation, confirmationModal } = useConfirmationModal();

  const pageSize = 12; // Optimal for card grid display

  // Load organizations data
  useEffect(() => {
    loadOrganizations();
  }, [currentPage, searchTerm, filterActive]);

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, filterActive]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      
      // Get organizations with branches for better display
      const result = await organizationService.getAllOrganizationsWithBranches(currentPage, pageSize);
      
      // Filter if needed
      let filteredOrgs = result.items;
      
      if (searchTerm) {
        filteredOrgs = filteredOrgs.filter(org => 
          org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (org.description && org.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (org.email && org.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (filterActive !== null) {
        filteredOrgs = filteredOrgs.filter(org => org.isActive === filterActive);
      }

      // Separate organizations and branches
      const orgs = filteredOrgs.map(org => ({
        id: org.id,
        name: org.name,
        description: org.description,
        website: org.website,
        email: org.email,
        phone: org.phone,
        address: org.address,
        city: org.city,
        state: org.state,
        country: org.country,
        zipCode: org.zipCode,
        logoUrl: org.logoUrl,
        establishedDate: org.establishedDate,
        industry: org.industry,
        isActive: org.isActive,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt
      }));

      const branchesMap = new Map<string, BranchWithManagerDto[]>();
      filteredOrgs.forEach(org => {
        branchesMap.set(org.id, org.branches || []);
      });

      setOrganizations(orgs);
      setOrganizationBranches(branchesMap);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      console.error('Error loading organizations:', err);
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Failed to load organizations. Please try again.';
      showError('Loading Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrganization = async (organization: OrganizationDto) => {
    showConfirmation({
      title: 'Delete Organization',
      message: `Are you sure you want to delete "${organization.name}"? This action cannot be undone and will also delete all associated branches.`,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await organizationService.deleteOrganization(organization.id);
          success('Organization Deleted', `Organization "${organization.name}" has been successfully deleted.`);
          loadOrganizations();
        } catch (err: any) {
          console.error('Error deleting organization:', err);
          const errorMessage = err?.response?.data?.message || 
                              err?.message || 
                              'Failed to delete organization. Please try again.';
          showError('Delete Failed', errorMessage);
        }
      }
    });
  };

  const handleToggleStatus = async (organization: OrganizationDto) => {
    try {
      await organizationService.toggleOrganizationStatus(organization.id, !organization.isActive);
      const statusText = !organization.isActive ? 'activated' : 'deactivated';
      success('Status Updated', `Organization has been successfully ${statusText}.`);
      loadOrganizations();
    } catch (err: any) {
      console.error('Error updating organization status:', err);
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Failed to update organization status. Please try again.';
      showError('Status Update Failed', errorMessage);
    }
  };

  const handleExport = async () => {
    try {
      // Get all organizations for export
      const allOrgs = await organizationService.getAllOrganizations(1, 1000);
      
      const csvContent = [
        ['Name', 'Description', 'Website', 'Email', 'Phone', 'Location', 'Status', 'Created At', 'Updated At'].join(','),
        ...allOrgs.items.map((org: OrganizationDto) => [
          `"${org.name}"`,
          `"${org.description || ''}"`,
          `"${org.website || ''}"`,
          `"${org.email || ''}"`,
          `"${org.phone || ''}"`,
          `"${[org.address, org.city, org.state, org.country].filter(Boolean).join(', ')}"`,
          org.isActive ? 'Active' : 'Inactive',
          new Date(org.createdAt).toLocaleDateString(),
          org.updatedAt ? new Date(org.updatedAt).toLocaleDateString() : ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `organizations_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      success('Export Successful', 'Organizations have been exported successfully.');
    } catch (err: any) {
      console.error('Error exporting organizations:', err);
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Failed to export organizations. Please try again.';
      showError('Export Failed', errorMessage);
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
              <div className="p-3 bg-primary-100 rounded-xl shadow-lg">
                <Building2 className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Organization Cockpit</h1>
                <p className="text-sm text-gray-600">Manage organizations and their branches</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Download className="w-5 h-5 text-green-600" />
              <span>Export</span>
            </button> 
            
            <button
              onClick={onNewOrganization}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Organization</span>
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
                  placeholder="Search organizations..."
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
              Showing {organizations.length} of {totalCount} organizations
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
        ) : organizations.length === 0 ? (
          // Empty State
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterActive !== null ? 'No organizations found' : 'No organizations created yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterActive !== null 
                  ? 'Try adjusting your search criteria or filters.' 
                  : 'Get started by creating your first organization.'
                }
              </p>
              {(!searchTerm && filterActive === null) && (
                <button
                  onClick={onNewOrganization}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Organization</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          // Organizations Grid
          <div className="h-full overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {organizations.map((organization) => (
                <OrganizationCard
                  key={organization.id}
                  organization={organization}
                  branches={organizationBranches.get(organization.id) || []}
                  onEdit={() => onEditOrganization?.(organization)}
                  onView={() => onViewOrganization?.(organization)}
                  onDelete={() => handleDeleteOrganization(organization)}
                  onToggleStatus={() => handleToggleStatus(organization)}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              itemName="organizations"
              onPageChange={setCurrentPage}
              loading={loading}
            />
          </div>
        )}
      </div>
      
      {/* Confirmation Modal */}
      {confirmationModal}
    </div>
  );
};
