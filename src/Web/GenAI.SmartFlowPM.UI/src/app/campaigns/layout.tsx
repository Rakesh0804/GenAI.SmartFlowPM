'use client';

import { AppLayout } from '../../components/layout';

export default function CampaignsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppLayout>
            {children}
        </AppLayout>
    );
}
