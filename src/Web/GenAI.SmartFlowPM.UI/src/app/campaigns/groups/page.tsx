'use client';

import CampaignGroups from '@/components/campaigns/CampaignGroups';
import { useRouter } from 'next/navigation';

export default function CampaignGroupsPage() {
  const router = useRouter();

  const handleNewGroup = () => {
    router.push('/campaigns/groups/new');
  };

  const handleEditGroup = (group: any) => {
    router.push(`/campaigns/groups/edit/${group.id}`);
  };

  const handleViewGroup = (group: any) => {
    router.push(`/campaigns/groups/view/${group.id}`);
  };

  const handleBackClick = () => {
    router.push('/campaigns');
  };

  return (
    <CampaignGroups
      onNewGroup={handleNewGroup}
      onEditGroup={handleEditGroup}
      onViewGroup={handleViewGroup}
      onBackClick={handleBackClick}
    />
  );
}
