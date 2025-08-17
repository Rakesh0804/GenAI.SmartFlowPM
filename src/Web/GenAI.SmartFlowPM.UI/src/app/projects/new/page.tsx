'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProjectDto } from '@/types/api.types';
import ProjectFormNew from '@/components/projects/ProjectFormNew';

export default function NewProjectPage() {
  const router = useRouter();

  const handleProjectSaved = (project: ProjectDto) => {
    console.log('Project saved:', project);
    router.push('/projects/cockpit');
  };

  const handleCancel = () => {
    router.push('/projects/cockpit');
  };

  const handleBack = () => {
    router.push('/projects/cockpit');
  };

  return (
    <ProjectFormNew
      mode="create"
      onSave={handleProjectSaved}
      onCancel={handleCancel}
      onBack={handleBack}
    />
  );
}
