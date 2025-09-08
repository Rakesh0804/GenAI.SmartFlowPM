'use client';

import CampaignGroupForm from '@/components/campaigns/CampaignGroupForm';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NewCampaignGroupPage() {
  const router = useRouter();

  const handleSave = (groupData: any) => {
    // Group form will handle the save operation
    // After successful save, redirect to groups page
    router.push('/campaigns/groups');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Campaign Group</h1>
            <p className="text-gray-600 mt-1">Create a user group for campaign targeting</p>
          </div>
        </div>
      </div>

      {/* Group Form */}
      <CampaignGroupForm
        mode="create"
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
