'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProjectDto } from '@/types/api.types';
import { projectService } from '@/services/project.service';
import ProjectFormNew from '@/components/projects/ProjectFormNew';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useToast } from '@/contexts/ToastContext';

function ViewProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    } else {
      showError('Project ID is required');
      router.push('/projects/cockpit');
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    try {
      setLoading(true);
      const projectData = await projectService.getProjectById(id);
      setProject(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
      showError('Failed to load project');
      router.push('/projects/cockpit');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (project) {
      router.push(`/projects/edit?id=${project.id}`);
    }
  };

  const handleBack = () => {
    router.push('/projects/cockpit');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/projects/cockpit')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProjectFormNew
      project={project}
      mode="view"
      onEdit={handleEdit}
      onBack={handleBack}
    />
  );
}

export default function ViewProjectPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <ViewProjectContent />
    </Suspense>
  );
}
