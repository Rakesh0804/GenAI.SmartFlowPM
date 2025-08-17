'use client';

import TeamFormNew from '@/components/teams/TeamFormNew';
import { useRouter } from 'next/navigation';

export default function NewTeamPage() {
  const router = useRouter();

  const handleSave = (team: any) => {
    console.log('Team saved:', team);
    router.push('/teams/cockpit');
  };

  const handleCancel = () => {
    router.push('/teams/cockpit');
  };

  const handleBack = () => {
    router.push('/teams/cockpit');
  };

  return (
    <TeamFormNew
      mode="create"
      onSave={handleSave}
      onCancel={handleCancel}
      onBack={handleBack}
    />
  );
}
