'use client';

import CampaignForm from '@/components/campaigns/CampaignForm';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NewCampaignPage() {
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
        mode="create"
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
