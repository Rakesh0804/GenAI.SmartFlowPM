'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UserProfile from '@/components/users/UserProfile';
import { AppLayout } from '@/components/layout/AppLayout';

export default function UserProfilePage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard');
  };

  return (
    <AppLayout>
      <UserProfile onBackClick={handleBackClick} />
    </AppLayout>
  );
}
