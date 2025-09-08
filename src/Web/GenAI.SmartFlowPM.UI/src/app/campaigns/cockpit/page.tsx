'use client';

import CampaignCockpit from '@/components/campaigns/CampaignCockpit';
import { useRouter } from 'next/navigation';

export default function CampaignCockpitPage() {
  const router = useRouter();

  const handleNewCampaign = () => {
    router.push('/campaigns/new');
  };

  const handleEditCampaign = (campaign: any) => {
    router.push(`/campaigns/edit/${campaign.id}`);
  };

  const handleViewCampaign = (campaign: any) => {
    router.push(`/campaigns/view/${campaign.id}`);
  };

  const handleBackClick = () => {
    router.push('/campaigns');
  };

  return (
    <CampaignCockpit
      onNewCampaign={handleNewCampaign}
      onEditCampaign={handleEditCampaign}
      onViewCampaign={handleViewCampaign}
      onBackClick={handleBackClick}
    />
  );
}
