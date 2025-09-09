'use client';

import React, { useState, useEffect } from 'react';
import { tenantService } from '../../services/tenant.service';
import { TenantDto } from '../../types/api.types';
import { 
  Building, Building2, Calendar, Globe, Mail, Phone, MapPin, Search, Filter, CirclePlus, 
  MoreVertical, Edit, Eye, X, Clock, CheckCircle, XCircle, Users, FolderOpen, 
  CreditCard, AlertTriangle, Crown, DollarSign, CalendarDays, Server 
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/common/Pagination';
import { CustomSelect } from '@/components/common/CustomSelect';
import ConfirmationModal, { useConfirmationModal } from '@/components/common/ConfirmationModal';

interface TenantCockpitProps {
  onNewTenant: () => void;
  onEditTenant: (tenant: TenantDto) => void;
  onViewTenant: (tenant: TenantDto) => void;
  onBackClick: () => void;
}

// Tenant Card Component (matches OrganizationCard exactly)
interface TenantCardProps {
  tenant: TenantDto;
  onEdit: (tenant: TenantDto) => void;
  onView: (tenant: TenantDto) => void;
  onDelete: (tenant: TenantDto) => void;
}

const TenantCard: React.FC<TenantCardProps> = ({ tenant, onEdit, onView, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-3 h-3" />
    ) : (
      <XCircle className="w-3 h-3" />
    );
  };

  const getSubscriptionStatus = () => {
    if (!tenant.subscriptionEndDate) return { status: 'Active', color: 'green', icon: CheckCircle };
    
    const endDate = new Date(tenant.subscriptionEndDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'Expired', color: 'red', icon: AlertTriangle };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'Expiring Soon', color: 'orange', icon: AlertTriangle };
    }
    return { status: 'Active', color: 'green', icon: CheckCircle };
  };

  const getPlanIcon = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'enterprise': return Crown;
      case 'premium': return CreditCard;
      case 'standard': return Server;
      default: return Calendar;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleToggleStatus = () => {
    // TODO: Implement toggle status functionality
    console.log('Toggle status for tenant:', tenant.id);
  };

  const handleDelete = () => {
    onDelete(tenant);
  };

  const subscriptionStatus = getSubscriptionStatus();
  const PlanIcon = tenant.subscriptionPlan ? getPlanIcon(tenant.subscriptionPlan) : Calendar;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Card Header with Gradient */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-md">
              <Server className="w-6 h-6 text-white" />
            </div>
            {/* Status indicator dot */}
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              tenant.isActive ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {tenant.name}
            </h3>
            {tenant.subDomain && (
              <p className="text-sm text-primary-600 font-medium">{tenant.subDomain}.smartflowpm.com</p>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <div className={`flex items-center space-x-1 ${getStatusColor(tenant.isActive)}`}>
                {getStatusIcon(tenant.isActive)}
                <span className="text-xs font-medium">
                  {tenant.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => onView(tenant)}
            className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onEdit(tenant)}
            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
            title="Edit Tenant"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="More Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                <button
                  onClick={() => {
                    handleToggleStatus();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200"
                >
                  {tenant.isActive ? <XCircle className="w-4 h-4 text-orange-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                  <span>{tenant.isActive ? 'Disable' : 'Enable'} Tenant</span>
                </button>
                
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Delete Tenant</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-5">
        {/* Tenant Name */}
        <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Server className="w-4 h-4 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary-700 uppercase tracking-wide">Tenant Name</p>
            <p className="text-sm font-bold text-gray-900 break-words">{tenant.name}</p>
          </div>
        </div>

        {/* Description */}
        {tenant.description && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              {tenant.description}
            </p>
          </div>
        )}

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-gray-900 truncate">{tenant.contactEmail}</p>
            </div>
          </div>

          {tenant.contactPhone && (
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Phone className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">Phone</p>
                <p className="text-sm font-medium text-gray-900">{tenant.contactPhone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        {(tenant.address || tenant.city || tenant.country) && (
          <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MapPin className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-orange-700 uppercase tracking-wide mb-1">Location</p>
              <p className="text-sm font-medium text-gray-900 leading-relaxed">
                {[tenant.address, tenant.city, tenant.state, tenant.country]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Subscription Plan */}
        {tenant.subscriptionPlan && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <PlanIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-primary-700 uppercase tracking-wide">Subscription Plan</p>
                <p className="text-lg font-bold text-secondary-500">{tenant.subscriptionPlan}</p>
              </div>
            </div>
            
            {/* Plan Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-2 bg-white/60 rounded-md">
                <Users className="w-4 h-4 text-primary-600" />
                <div>
                  <p className="text-xs text-primary-700">Users</p>
                  <p className="text-sm font-semibold text-gray-900">{tenant.maxUsers}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white/60 rounded-md">
                <FolderOpen className="w-4 h-4 text-primary-600" />
                <div>
                  <p className="text-xs text-primary-700">Projects</p>
                  <p className="text-sm font-semibold text-gray-900">{tenant.maxProjects}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Status & Expiry */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              subscriptionStatus.color === 'green' ? 'bg-green-100' :
              subscriptionStatus.color === 'orange' ? 'bg-orange-100' : 'bg-red-100'
            }`}>
              <subscriptionStatus.icon className={`w-4 h-4 ${
                subscriptionStatus.color === 'green' ? 'text-green-600' :
                subscriptionStatus.color === 'orange' ? 'text-orange-600' : 'text-red-600'
              }`} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
              <p className={`text-sm font-semibold ${
                subscriptionStatus.color === 'green' ? 'text-green-700' :
                subscriptionStatus.color === 'orange' ? 'text-orange-700' : 'text-red-700'
              }`}>
                {subscriptionStatus.status}
              </p>
            </div>
          </div>
          
          {tenant.subscriptionEndDate && (
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expires</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(tenant.subscriptionEndDate)}</p>
            </div>
          )}
        </div>

        {/* Regional Settings */}
        {(tenant.timeZone || tenant.currency) && (
          <div className="grid grid-cols-2 gap-3">
            {tenant.timeZone && (
              <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Globe className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-indigo-700 uppercase tracking-wide">Timezone</p>
                  <p className="text-sm font-semibold text-gray-900">{tenant.timeZone}</p>
                </div>
              </div>
            )}
            
            {tenant.currency && (
              <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Currency</p>
                  <p className="text-sm font-semibold text-gray-900">{tenant.currency}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Created {formatDate(tenant.createdAt)}</span>
          </div>
          {tenant.updatedAt && (
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <CalendarDays className="w-4 h-4" />
              <span>Updated {formatDate(tenant.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main TenantCockpit Component
export const TenantCockpit: React.FC<TenantCockpitProps> = ({
  onNewTenant,
  onEditTenant,
  onViewTenant,
  onBackClick
}) => {
  const [tenants, setTenants] = useState<TenantDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const { success, error: showError } = useToast();
  const { showConfirmation, confirmationModal } = useConfirmationModal();

  const pageSize = 12; // Optimal for card grid display

  // Load tenants data
  useEffect(() => {
    loadTenants();
  }, [currentPage, searchTerm, filterActive]);

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, filterActive]);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const result = await tenantService.getTenantsPaginated(
        currentPage,
        pageSize
      );
      
      let filteredTenants = result.items || [];
      
      // Apply search filter
      if (searchTerm) {
        filteredTenants = filteredTenants.filter(tenant =>
          tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tenant.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tenant.subDomain && tenant.subDomain.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Apply active filter
      if (filterActive !== null) {
        filteredTenants = filteredTenants.filter(tenant => tenant.isActive === filterActive);
      }
      
      setTenants(filteredTenants);
      setTotalCount(result.totalCount || filteredTenants.length);
      setTotalPages(result.totalPages || Math.ceil(filteredTenants.length / pageSize));
    } catch (error) {
      console.error('Error loading tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTenant = async (tenant: TenantDto) => {
    showConfirmation({
      title: 'Delete Tenant',
      message: `Are you sure you want to delete the tenant "${tenant.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await tenantService.deleteTenant(tenant.id);
          success('Tenant Deleted', `Tenant "${tenant.name}" has been successfully deleted.`);
          loadTenants();
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || 
                              error?.message || 
                              'Failed to delete tenant. Please try again.';
          showError('Delete Failed', errorMessage);
        }
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterActive(null);
    setCurrentPage(1);
  };

  const getFilteredResultsText = () => {
    if (totalCount === 0) {
      return searchTerm ? `No tenants match "${searchTerm}"` : 'No tenants found';
    }
    
    let text = `Showing ${tenants.length} of ${totalCount} tenant${totalCount !== 1 ? 's' : ''}`;
    if (searchTerm) {
      text += ` matching "${searchTerm}"`;
    }
    return text;
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
                <Server className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tenant Cockpit</h1>
                <p className="text-sm text-gray-600">Manage client organizations and subscriptions</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onNewTenant}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <CirclePlus className="w-4 h-4" />
              <span>Add Tenant</span>
            </button>

            <button
              onClick={onBackClick}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            >
              <X className="w-4 h-4" />
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
                  placeholder="Search tenants..."
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

              {(searchTerm || filterActive !== null) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {getFilteredResultsText()}
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
        ) : tenants.length === 0 ? (
          // Empty State
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tenants Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No tenants match "${searchTerm}"` : 'Get started by creating your first tenant'}
              </p>
              <button
                onClick={onNewTenant}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <CirclePlus className="w-4 h-4" />
                <span>Add First Tenant</span>
              </button>
            </div>
          </div>
        ) : (
          // Tenant Grid
          <div className="h-full overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tenants.map((tenant) => (
                <TenantCard
                  key={tenant.id}
                  tenant={tenant}
                  onEdit={onEditTenant}
                  onView={onViewTenant}
                  onDelete={handleDeleteTenant}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              itemName="tenants"
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
