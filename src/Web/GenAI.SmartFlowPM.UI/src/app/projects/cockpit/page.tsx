'use client';

import { useRouter } from 'next/navigation';
import { ProjectCockpit } from '../../../components/projects/ProjectCockpit';
import { ProjectDto } from '../../../types/api.types';

export default function ProjectCockpitPage() {
  const router = useRouter();

  const handleNewProject = () => {
    router.push('/projects/new');
  };

  const handleEditProject = (project: ProjectDto) => {
    router.push(`/projects/edit?id=${project.id}`);
  };

  const handleViewProject = (project: ProjectDto) => {
    router.push(`/projects/view?id=${project.id}`);
  };

  const handleBackClick = () => {
    router.push('/projects');
  };

  return (
    <ProjectCockpit 
      onNewProject={handleNewProject}
      onEditProject={handleEditProject}
      onViewProject={handleViewProject}
      onBackClick={handleBackClick}
    />
  );
}
