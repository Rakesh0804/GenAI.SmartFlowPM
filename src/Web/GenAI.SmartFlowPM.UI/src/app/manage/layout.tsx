'use client';

import { AppLayout } from '../../components/layout';

export default function ManageLayout({
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
