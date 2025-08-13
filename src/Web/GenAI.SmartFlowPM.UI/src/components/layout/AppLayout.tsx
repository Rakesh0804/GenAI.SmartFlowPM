'use client';

import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { SidebarProvider, useSidebar } from '../../contexts/SidebarContext';

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayoutContent: React.FC<AppLayoutProps> = ({ children }) => {
    const { isCollapsed } = useSidebar();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'
                }`}>
                {/* Top Bar */}
                <TopBar />

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <SidebarProvider>
            <AppLayoutContent>{children}</AppLayoutContent>
        </SidebarProvider>
    );
};
