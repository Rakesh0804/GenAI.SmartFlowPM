'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TeamFormNew from '@/components/teams/TeamFormNew';
import { TeamDto } from '@/types/api.types';
import { teamService } from '@/services/team.service';

export default function EditTeamPage() {
  const params = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<TeamDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        if (params.id) {
          const teamData = await teamService.getTeam(params.id as string);
          setTeam(teamData);
        }
      } catch (error) {
        console.error('Error loading team:', error);
        router.push('/teams/cockpit');
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [params.id, router]);

  const handleSave = (savedTeam: TeamDto) => {
    console.log('Team saved:', savedTeam);
    router.push('/teams/cockpit');
  };

  const handleCancel = () => {
    router.push('/teams/cockpit');
  };

  const handleBack = () => {
    router.push('/teams/cockpit');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Team not found</p>
        </div>
      </div>
    );
  }

  return (
    <TeamFormNew
      team={team}
      mode="edit"
      onSave={handleSave}
      onCancel={handleCancel}
      onBack={handleBack}
    />
  );
}
