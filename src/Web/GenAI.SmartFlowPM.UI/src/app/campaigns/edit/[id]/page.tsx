'use client';

import CampaignForm from '@/components/campaigns/CampaignForm';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { use } from 'react';

interface EditCampaignPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCampaignPage({ params }: EditCampaignPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const handleSave = (campaignData: any) => {
    // Campaign form will handle the save operation
    // After successful save, redirect to campaigns page
    router.push('/campaigns');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Campaign Form */}
      <CampaignForm
        mode="edit"
        campaignId={id}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
