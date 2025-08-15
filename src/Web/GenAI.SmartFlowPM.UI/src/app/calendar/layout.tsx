'use client';

import { AppLayout } from '../../components/layout';

export default function CalendarLayout({
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
