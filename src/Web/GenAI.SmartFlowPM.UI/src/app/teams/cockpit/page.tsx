'use client';

import TeamCockpit from '@/components/teams/TeamCockpit';
import { useRouter } from 'next/navigation';

export default function TeamCockpitPage() {
  const router = useRouter();

  const handleNewTeam = () => {
    router.push('/teams/new');
  };

  const handleEditTeam = (team: any) => {
    router.push(`/teams/edit/${team.id}`);
  };

  const handleViewTeam = (team: any) => {
    router.push(`/teams/view/${team.id}`);
  };

  const handleBackClick = () => {
    router.push('/teams');
  };

  return (
    <TeamCockpit
      onNewTeam={handleNewTeam}
      onEditTeam={handleEditTeam}
      onViewTeam={handleViewTeam}
      onBackClick={handleBackClick}
    />
  );
}
