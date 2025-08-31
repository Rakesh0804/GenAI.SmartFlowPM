'use client';

import React, { useState, useEffect } from 'react';
import { 
  TenantDto, 
  CreateTenantDto, 
  UpdateTenantDto,
  SUBSCRIPTION_PLANS,
  TIMEZONES,
  CURRENCIES 
} from '@/interfaces/tenant.interfaces';
import { tenantService } from '@/services/tenant.service';
import { useToast } from '@/contexts/ToastContext';
import { CustomSelect } from '@/components/common/CustomSelect';
import { 
  Server, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  Save, 
  X, 
  Calendar,
  Users,
  FolderOpen,
  Clock,
  DollarSign,
  CreditCard,
  Loader2
} from 'lucide-react';

interface TenantFormNewProps {
  tenant?: TenantDto;
  mode: 'create' | 'edit' | 'view';
  onSave?: (tenant: TenantDto) => void;
  onCancel?: () => void;
  onBack?: () => void;
}

interface TenantFormData {
  name: string;
  subDomain: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionPlan: string;
  maxUsers: number;
  maxProjects: number;
  timeZone: string;
  currency: string;
  logoUrl: string;
}

export const TenantFormNew: React.FC<TenantFormNewProps> = ({
  tenant,
  mode,
  onSave,
  onCancel,
  onBack
}) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const isReadOnly = mode === 'view';
  const isEditing = mode === 'edit';
  const isCreating = mode === 'create';

  const [formData, setFormData] = useState<TenantFormData>({
    name: tenant?.name || '',
    subDomain: tenant?.subDomain || '',
    description: tenant?.description || '',
    contactEmail: tenant?.contactEmail || '',
    contactPhone: tenant?.contactPhone || '',
    address: tenant?.address || '',
    city: tenant?.city || '',
    state: tenant?.state || '',
    postalCode: tenant?.postalCode || '',
    country: tenant?.country || '',
    subscriptionStartDate: tenant?.subscriptionStartDate 
      ? new Date(tenant.subscriptionStartDate).toISOString().split('T')[0] 
      : '',
    subscriptionEndDate: tenant?.subscriptionEndDate 
      ? new Date(tenant.subscriptionEndDate).toISOString().split('T')[0] 
      : '',
    subscriptionPlan: tenant?.subscriptionPlan || 'Basic',
    maxUsers: tenant?.maxUsers || 10,
    maxProjects: tenant?.maxProjects || 5,
    timeZone: tenant?.timeZone || 'UTC',
    currency: tenant?.currency || 'USD',
    logoUrl: tenant?.logoUrl || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | number = value;
    
    if (type === 'number') {
      finalValue = parseInt(value) || 0;
    }
    
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

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Tenant name is required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Subdomain validation
    if (formData.subDomain && !tenantService.isValidSubdomain(formData.subDomain)) {
      newErrors.subDomain = 'Subdomain must be 3-63 characters, alphanumeric and hyphens only';
    }

    // Phone validation
    if (formData.contactPhone && !/^\+?[\d\s\-\(\)]+$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }

    // Numeric validations
    if (formData.maxUsers < 1) {
      newErrors.maxUsers = 'Maximum users must be at least 1';
    }

    if (formData.maxProjects < 1) {
      newErrors.maxProjects = 'Maximum projects must be at least 1';
    }

    // Date validation
    if (formData.subscriptionStartDate && formData.subscriptionEndDate) {
      const startDate = new Date(formData.subscriptionStartDate);
      const endDate = new Date(formData.subscriptionEndDate);
      
      if (endDate <= startDate) {
        newErrors.subscriptionEndDate = 'End date must be after start date';
      }
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
      const tenantData: CreateTenantDto | UpdateTenantDto = {
        name: formData.name.trim(),
        subDomain: formData.subDomain.trim() || undefined,
        description: formData.description.trim() || undefined,
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim() || undefined,
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
        postalCode: formData.postalCode.trim() || undefined,
        country: formData.country.trim() || undefined,
        subscriptionStartDate: formData.subscriptionStartDate 
          ? new Date(formData.subscriptionStartDate) 
          : undefined,
        subscriptionEndDate: formData.subscriptionEndDate 
          ? new Date(formData.subscriptionEndDate) 
          : undefined,
        subscriptionPlan: formData.subscriptionPlan || undefined,
        maxUsers: formData.maxUsers,
        maxProjects: formData.maxProjects,
        timeZone: formData.timeZone || undefined,
        currency: formData.currency || undefined,
        logoUrl: formData.logoUrl.trim() || undefined
      };

      let savedTenant: TenantDto;

      if (isCreating) {
        savedTenant = await tenantService.createTenant(tenantData as CreateTenantDto);
        success('Tenant created successfully');
      } else {
        savedTenant = await tenantService.updateTenant(tenant!.id, {
          ...tenantData,
          id: tenant!.id
        } as UpdateTenantDto);
        success('Tenant updated successfully');
      }

      if (onSave) {
        onSave(savedTenant);
      }
    } catch (err) {
      console.error('Error saving tenant:', err);
      error(isCreating ? 'Failed to create tenant' : 'Failed to update tenant');
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

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Tenant';
      case 'edit':
        return 'Edit Tenant';
      case 'view':
        return 'Tenant Details';
      default:
        return 'Tenant';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'create':
        return 'Create a new client organization';
      case 'edit':
        return 'Modify tenant information and settings';
      case 'view':
        return 'View tenant details and status';
      default:
        return '';
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
                <Server className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
                <p className="text-sm text-gray-600">{getSubtitle()}</p>
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
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Basic Information</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Tenant Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Server className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                        placeholder="Enter tenant name"
                        disabled={loading}
                        required
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subDomain" className="block text-sm font-medium text-gray-700">
                      Subdomain
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="subDomain"
                        name="subDomain"
                        value={formData.subDomain}
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                        placeholder="my-company"
                        disabled={loading}
                      />
                    </div>
                    {errors.subDomain && (
                      <p className="text-sm text-red-600">{errors.subDomain}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                        placeholder="contact@company.com"
                        disabled={loading}
                        required
                      />
                    </div>
                    {errors.contactEmail && (
                      <p className="text-sm text-red-600">{errors.contactEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                        placeholder="+1 (555) 123-4567"
                        disabled={loading}
                      />
                    </div>
                    {errors.contactPhone && (
                      <p className="text-sm text-red-600">{errors.contactPhone}</p>
                    )}
                  </div>

                  <div className="lg:col-span-4 space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      readOnly={isReadOnly}
                      rows={3}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                        isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                      }`}
                      placeholder="Brief description of the organization"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Address Information</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-4 space-y-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                        placeholder="123 Main Street"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      readOnly={isReadOnly}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                        isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                      }`}
                      placeholder="New York"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      readOnly={isReadOnly}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                        isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                      }`}
                      placeholder="NY"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      readOnly={isReadOnly}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                        isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                      }`}
                      placeholder="10001"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      readOnly={isReadOnly}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                        isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                      }`}
                      placeholder="United States"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Subscription & Limits */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Subscription & Limits</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="subscriptionPlan" className="block text-sm font-medium text-gray-700">
                      Subscription Plan
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                      <CustomSelect
                        value={formData.subscriptionPlan}
                        onChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            subscriptionPlan: value
                          }));
                        }}
                        options={SUBSCRIPTION_PLANS.map(plan => ({
                          value: plan.value,
                          label: plan.label
                        }))}
                        disabled={isReadOnly || loading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="maxUsers" className="block text-sm font-medium text-gray-700">
                      Max Users
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        id="maxUsers"
                        name="maxUsers"
                        min="1"
                        max="10000"
                        value={formData.maxUsers}
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                        disabled={loading}
                      />
                    </div>
                    {errors.maxUsers && (
                      <p className="text-sm text-red-600">{errors.maxUsers}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="maxProjects" className="block text-sm font-medium text-gray-700">
                      Max Projects
                    </label>
                    <div className="relative">
                      <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        id="maxProjects"
                        name="maxProjects"
                        min="1"
                        max="1000"
                        value={formData.maxProjects}
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                        disabled={loading}
                      />
                    </div>
                    {errors.maxProjects && (
                      <p className="text-sm text-red-600">{errors.maxProjects}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      id="logoUrl"
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleInputChange}
                      readOnly={isReadOnly}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                        isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                      }`}
                      placeholder="https://example.com/logo.png"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subscriptionStartDate" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        id="subscriptionStartDate"
                        name="subscriptionStartDate"
                        value={formData.subscriptionStartDate}
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subscriptionEndDate" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        id="subscriptionEndDate"
                        name="subscriptionEndDate"
                        value={formData.subscriptionEndDate}
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                          isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                        disabled={loading}
                      />
                    </div>
                    {errors.subscriptionEndDate && (
                      <p className="text-sm text-red-600">{errors.subscriptionEndDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">
                      Time Zone
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                      <CustomSelect
                        value={formData.timeZone}
                        onChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            timeZone: value
                          }));
                        }}
                        options={TIMEZONES.map(tz => ({
                          value: tz.value,
                          label: tz.label
                        }))}
                        disabled={isReadOnly || loading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                      <CustomSelect
                        value={formData.currency}
                        onChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            currency: value
                          }));
                        }}
                        options={CURRENCIES.map(currency => ({
                          value: currency.value,
                          label: currency.label
                        }))}
                        disabled={isReadOnly || loading}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Information (View mode only) */}
              {isReadOnly && tenant && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Status Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tenant.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div>Created: {tenant?.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}</div>
                      {tenant?.updatedAt && (
                        <div>Updated: {new Date(tenant.updatedAt).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              {!isReadOnly && (
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{loading ? 'Saving...' : (isCreating ? 'Create Tenant' : 'Update Tenant')}</span>
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
