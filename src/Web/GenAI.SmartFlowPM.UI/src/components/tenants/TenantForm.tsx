import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Save, 
  X, 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  FolderOpen,
  Calendar,
  CreditCard,
  Clock,
  DollarSign
} from 'lucide-react';
import { TenantDto, CreateTenantDto, UpdateTenantDto, TenantFormData, SUBSCRIPTION_PLANS, TIMEZONES, CURRENCIES } from '../../interfaces/tenant.interface';
import { tenantService } from '../../services/tenant.service';

interface TenantFormProps {
  tenant?: TenantDto;
  mode: 'create' | 'edit' | 'view';
  onSave: (tenant: TenantDto) => void;
  onCancel: () => void;
}

export const TenantForm: React.FC<TenantFormProps> = ({
  tenant,
  mode,
  onSave,
  onCancel
}) => {
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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof TenantFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
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
      } else {
        savedTenant = await tenantService.updateTenant(tenant!.id, {
          ...tenantData,
          id: tenant!.id
        } as UpdateTenantDto);
      }

      onSave(savedTenant);
    } catch (error) {
      console.error('Error saving tenant:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
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

  const getStatusInfo = () => {
    if (!tenant) return null;
    
    const status = tenantService.getTenantStatus(tenant);
    const daysRemaining = tenantService.getSubscriptionDaysRemaining(tenant);
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-900">Status Information</h4>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status.color === 'green' ? 'bg-green-100 text-green-800' :
            status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status.label}
          </span>
          {daysRemaining !== null && (
            <span className="text-xs text-gray-500">
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          <div>Created: {tenant?.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}</div>
          {tenant?.updatedAt && (
            <div>Updated: {new Date(tenant.updatedAt).toLocaleDateString()}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="w-7 h-7 text-primary-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{getTitle()}</h1>
              <p className="text-primary-100 mt-1">
                {isCreating && 'Create a new client organization'}
                {isEditing && 'Modify tenant information and settings'}
                {isReadOnly && 'View tenant details and status'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-primary-600" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tenant Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    } ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter tenant name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Subdomain
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.subDomain}
                      onChange={(e) => handleInputChange('subDomain', e.target.value)}
                      readOnly={isReadOnly}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                        isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                      } ${errors.subDomain ? 'border-red-500' : ''}`}
                      placeholder="my-company"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">.smartflow.com</span>
                    </div>
                  </div>
                  {errors.subDomain && (
                    <p className="mt-1 text-sm text-red-600">{errors.subDomain}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    readOnly={isReadOnly}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of the organization"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary-600" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    } ${errors.contactEmail ? 'border-red-500' : ''}`}
                    placeholder="contact@company.com"
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    } ${errors.contactPhone ? 'border-red-500' : ''}`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.contactPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                Address Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    }`}
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    }`}
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    }`}
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    }`}
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    }`}
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Subscription & Limits */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                Subscription & Limits
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Plan
                  </label>
                  <select
                    value={formData.subscriptionPlan}
                    onChange={(e) => handleInputChange('subscriptionPlan', e.target.value)}
                    disabled={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    }`}
                  >
                    {SUBSCRIPTION_PLANS.map(plan => (
                      <option key={plan} value={plan}>{plan}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Max Users
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={formData.maxUsers}
                    onChange={(e) => handleInputChange('maxUsers', parseInt(e.target.value) || 0)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    } ${errors.maxUsers ? 'border-red-500' : ''}`}
                  />
                  {errors.maxUsers && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxUsers}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FolderOpen className="w-4 h-4 inline mr-1" />
                    Max Projects
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.maxProjects}
                    onChange={(e) => handleInputChange('maxProjects', parseInt(e.target.value) || 0)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    } ${errors.maxProjects ? 'border-red-500' : ''}`}
                  />
                  {errors.maxProjects && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxProjects}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.subscriptionStartDate}
                    onChange={(e) => handleInputChange('subscriptionStartDate', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.subscriptionEndDate}
                    onChange={(e) => handleInputChange('subscriptionEndDate', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    } ${errors.subscriptionEndDate ? 'border-red-500' : ''}`}
                  />
                  {errors.subscriptionEndDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.subscriptionEndDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-600" />
                Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Zone
                  </label>
                  <select
                    value={formData.timeZone}
                    onChange={(e) => handleInputChange('timeZone', e.target.value)}
                    disabled={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    }`}
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    disabled={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    }`}
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>

            {/* Status Information (View mode only) */}
            {isReadOnly && tenant && getStatusInfo()}

            {/* Form Actions */}
            {!isReadOnly && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{loading ? 'Saving...' : isCreating ? 'Create Tenant' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
