'use client';

import CampaignGroupDetails from '@/components/campaigns/CampaignGroupDetails';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { use } from 'react';

interface ViewCampaignGroupPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ViewCampaignGroupPage({ params }: ViewCampaignGroupPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/campaigns/groups/edit/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaign Group Details</h1>
            <p className="text-gray-600 mt-1">View group information and members</p>
          </div>
        </div>
      </div>

      {/* Group Details */}
      <CampaignGroupDetails
        groupId={id}
        onEdit={handleEdit}
        onBack={handleBack}
      />
    </div>
  );
}
