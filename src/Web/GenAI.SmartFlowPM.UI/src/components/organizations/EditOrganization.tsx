'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Info,
  Globe,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react';
import { organizationService } from '@/services/organization.service';
import { OrganizationDto, UpdateOrganizationDto } from '@/types/api.types';
import { useToast } from '@/contexts/ToastContext';

interface EditOrganizationProps {
  organizationId: string;
  readOnly?: boolean;
  onBack: () => void;
  onOrganizationUpdated?: (organization: OrganizationDto) => void;
}

interface FormData {
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  logo: string;
  establishedDate: string;
  employeeCount: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  website?: string;
  employeeCount?: string;
  general?: string;
}

export const EditOrganization: React.FC<EditOrganizationProps> = ({
  organizationId,
  readOnly = false,
  onBack,
  onOrganizationUpdated
}) => {
  const { success: showSuccess, error: showError } = useToast();
  const [organization, setOrganization] = useState<OrganizationDto | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    logo: '',
    establishedDate: '',
    employeeCount: 0
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [loadingOrganization, setLoadingOrganization] = useState(true);

  useEffect(() => {
    loadOrganization();
  }, [organizationId]);

  const loadOrganization = async () => {
    try {
      setLoadingOrganization(true);
      const orgData = await organizationService.getOrganizationById(organizationId);
      setOrganization(orgData);
      setFormData({
        name: orgData.name || '',
        description: orgData.description || '',
        website: orgData.website || '',
        email: orgData.email || '',
        phone: orgData.phone || '',
        address: orgData.address || '',
        city: orgData.city || '',
        state: orgData.state || '',
        country: orgData.country || '',
        postalCode: orgData.zipCode || '',
        logo: orgData.logoUrl || '',
        establishedDate: orgData.establishedDate || '',
        employeeCount: 0 // This would need proper mapping
      });
    } catch (error) {
      console.error('Error loading organization:', error);
      showError('Failed to load organization details');
    } finally {
      setLoadingOrganization(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Organization name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Organization name must be at least 2 characters long';
    } else if (formData.name.trim().length > 200) {
      newErrors.name = 'Organization name must be less than 200 characters';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    if (formData.employeeCount < 0) {
      newErrors.employeeCount = 'Employee count must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear related errors
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (readOnly) return;

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const updateData: UpdateOrganizationDto = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        website: formData.website?.trim() || '',
        email: formData.email?.trim() || '',
        phone: formData.phone?.trim() || '',
        address: formData.address?.trim() || '',
        city: formData.city?.trim() || '',
        state: formData.state?.trim() || '',
        country: formData.country?.trim() || '',
        postalCode: formData.postalCode?.trim() || '',
        logo: formData.logo?.trim() || '',
        establishedDate: formData.establishedDate || '',
        employeeCount: formData.employeeCount
      };

      const updatedOrganization = await organizationService.updateOrganization(organizationId, updateData);
      showSuccess('Organization updated successfully');
      
      if (onOrganizationUpdated) {
        onOrganizationUpdated(updatedOrganization);
      }
    } catch (error: any) {
      console.error('Error updating organization:', error);
      
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const serverErrors: FormErrors = {};
        const errorData = error.response.data.errors;
        
        if (errorData.Name) {
          serverErrors.name = errorData.Name[0];
        }
        if (errorData.Email) {
          serverErrors.email = errorData.Email[0];
        }
        if (errorData.Website) {
          serverErrors.website = errorData.Website[0];
        }
        
        setErrors(serverErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        showError('Failed to update organization. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loadingOrganization) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading organization details...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Not Found</h3>
          <p className="text-gray-600 mb-4">The requested organization could not be found.</p>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Organizations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex-none">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Building2 className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {readOnly ? 'View Organization' : 'Edit Organization'}
                </h1>
                <p className="text-sm text-gray-600">
                  {readOnly ? 'Organization details and information' : 'Modify organization settings and information'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {readOnly && (
              <div className="flex items-center space-x-1 text-primary-600">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">View Mode</span>
              </div>
            )}
            
            <button
              type="button"
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Organizations</span>
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
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Organization Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Organization Name {!readOnly && <span className="text-red-500">*</span>}
                    </label>
                    {readOnly ? (
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <div className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {formData.name || 'Not specified'}
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter organization name"
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          disabled={loading}
                          required
                        />
                      </div>
                    )}
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Industry */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Industry
                    </label>
                    {readOnly ? (
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <div className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {organization.industry || 'Not specified'}
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value=""
                          readOnly
                          placeholder="Industry field not yet implemented"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Description - Full width */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  {readOnly ? (
                    <div className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[120px]">
                      {formData.description || 'No description provided'}
                    </div>
                  ) : (
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the organization..."
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                      disabled={loading}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="establishedDate" className="block text-sm font-medium text-gray-700">
                      Established Date
                    </label>
                    {readOnly ? (
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <div className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {formData.establishedDate ? new Date(formData.establishedDate).toLocaleDateString() : 'Not specified'}
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="date"
                          id="establishedDate"
                          name="establishedDate"
                          value={formData.establishedDate}
                          onChange={(e) => handleInputChange('establishedDate', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          disabled={loading}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">
                      Employee Count
                    </label>
                    {readOnly ? (
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                        {formData.employeeCount || 'Not specified'}
                      </div>
                    ) : (
                      <input
                        type="number"
                        id="employeeCount"
                        name="employeeCount"
                        value={formData.employeeCount}
                        onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        disabled={loading}
                      />
                    )}
                    {errors.employeeCount && (
                      <p className="text-sm text-red-600">{errors.employeeCount}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Contact Information</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    {readOnly ? (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <div className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {formData.email || 'Not specified'}
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="organization@company.com"
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          disabled={loading}
                        />
                      </div>
                    )}
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    {readOnly ? (
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <div className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {formData.phone || 'Not specified'}
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          disabled={loading}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    {readOnly ? (
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <div className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {formData.website || 'Not specified'}
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          placeholder="https://www.company.com"
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                            errors.website ? 'border-red-300' : 'border-gray-300'
                          }`}
                          disabled={loading}
                        />
                      </div>
                    )}
                    {errors.website && (
                      <p className="text-sm text-red-600">{errors.website}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Address Information</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    {readOnly ? (
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                        <div className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[80px]">
                          {formData.address || 'Not specified'}
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          rows={2}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                          placeholder="Street address"
                          disabled={loading}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      {readOnly ? (
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {formData.city || 'Not specified'}
                        </div>
                      ) : (
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          placeholder="City"
                          disabled={loading}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State/Province
                      </label>
                      {readOnly ? (
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {formData.state || 'Not specified'}
                        </div>
                      ) : (
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          placeholder="State"
                          disabled={loading}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      {readOnly ? (
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {formData.country || 'Not specified'}
                        </div>
                      ) : (
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          placeholder="Country"
                          disabled={loading}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      {readOnly ? (
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {formData.postalCode || 'Not specified'}
                        </div>
                      ) : (
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          placeholder="ZIP/Postal"
                          disabled={loading}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization Metadata (View Mode Only) */}
              {readOnly && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">Organization Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Created Date</label>
                      <div className="flex items-center space-x-2 text-gray-900 py-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(organization.createdAt.toString())}</span>
                      </div>
                    </div>
                    
                    {organization.updatedAt && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                        <div className="flex items-center space-x-2 text-gray-900 py-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(organization.updatedAt.toString())}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <div className="flex items-center space-x-2 py-3">
                        {organization.isActive ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-600 font-medium">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-600 font-medium">Inactive</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Information Notice */}
              {!readOnly && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Organization Management Information</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>Changes to organization details will be reflected system-wide</li>
                        <li>Contact information will be used for official communications</li>
                        <li>Address information may be visible to employees and managers</li>
                        <li>Consider the impact on all associated branches and users</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Form Actions */}
              {!readOnly && (
                <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="flex items-center space-x-2 px-8 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-8 py-3 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
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
