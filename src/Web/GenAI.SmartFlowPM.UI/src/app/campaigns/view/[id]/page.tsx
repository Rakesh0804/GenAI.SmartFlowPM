'use client';

import CampaignDetails from '@/components/campaigns/CampaignDetails';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Target } from 'lucide-react';
import { use } from 'react';

interface ViewCampaignPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ViewCampaignPage({ params }: ViewCampaignPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/campaigns/edit/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaign Details</h1>
              <p className="text-gray-600 mt-1">View campaign information and progress</p>
            </div>
          </div>
          <button
            onClick={handleBack}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Campaign Details */}
      <CampaignDetails
        campaignId={id}
        onEdit={handleEdit}
        onBack={handleBack}
      />
    </div>
  );
}
