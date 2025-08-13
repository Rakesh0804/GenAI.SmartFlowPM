'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSidebar } from '../../contexts/SidebarContext';
import {
    HomeIcon,
    FolderIcon,
    CheckSquareIcon,
    UsersIcon,
    CalendarIcon,
    ClockIcon,
    UserCheckIcon,
    FileIcon,
    MapIcon,
    DollarSignIcon,
    BarChart3Icon,
    MessageSquareIcon,
    BellIcon,
    SettingsIcon,
    LogOutIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    LucideIcon
} from 'lucide-react';

// Client-side check
const isClient = typeof window !== 'undefined';

interface MenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    href: string;
    badge?: number;
}

const menuItems: MenuItem[] = [
    { id: 'home', label: 'Home', icon: HomeIcon, href: '/dashboard' },
    { id: 'projects', label: 'Projects', icon: FolderIcon, href: '/projects' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquareIcon, href: '/tasks', badge: 12 },
    { id: 'team', label: 'Team', icon: UsersIcon, href: '/team' },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, href: '/calendar' },
    { id: 'timetracker', label: 'Time Tracker', icon: ClockIcon, href: '/timetracker' },
    { id: 'attendance', label: 'Attendance', icon: UserCheckIcon, href: '/attendance' },
    { id: 'files', label: 'Files', icon: FileIcon, href: '/files' },
    { id: 'travel', label: 'Travel', icon: MapIcon, href: '/travel' },
    { id: 'compensation', label: 'Compensation', icon: DollarSignIcon, href: '/compensation' },
    { id: 'reports', label: 'Reports', icon: BarChart3Icon, href: '/reports' },
    { id: 'chat', label: 'Chat', icon: MessageSquareIcon, href: '/chat', badge: 3 },
    { id: 'toast-demo', label: 'Toast Demo', icon: BellIcon, href: '/toast-demo' },
];

const bottomMenuItems: MenuItem[] = [
    { id: 'settings', label: 'Settings', icon: SettingsIcon, href: '/settings' },
    { id: 'logout', label: 'Logout', icon: LogOutIcon, href: '/logout' },
];

export const Sidebar: React.FC = () => {
    const { isCollapsed, toggleSidebar } = useSidebar();
    const [mounted, setMounted] = useState(false);
    const router = isClient ? useRouter() : null;
    const pathname = isClient ? usePathname() : '';

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNavigation = (href: string) => {
        if (!router || !mounted) return;

        if (href === '/logout') {
            // Handle logout logic
            localStorage.removeItem('token');
            router.push('/login');
        } else {
            router.push(href);
        }
    };

    const isActive = (href: string) => {
        if (!mounted) return false;
        return pathname === href || (href === '/dashboard' && pathname === '/');
    };

    // Don't render until mounted on client to avoid hydration issues
    if (!mounted) {
        return (
            <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50">
                <div className="p-4">
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 ${isCollapsed ? 'w-16' : 'w-64'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">SF</span>
                        </div>
                        <span className="font-bold text-gray-900">SmartFlowPM</span>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                    {isCollapsed ? (
                        <ChevronRightIcon size={20} />
                    ) : (
                        <ChevronLeftIcon size={20} />
                    )}
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.href)}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group ${active
                                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon
                                size={20}
                                className={`${isCollapsed ? 'mx-auto' : 'mr-3'} ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                            />
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge && (
                                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Navigation */}
            <div className="border-t border-gray-200 px-2 py-4 space-y-1">
                {bottomMenuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.href)}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group ${active
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon
                                size={20}
                                className={`${isCollapsed ? 'mx-auto' : 'mr-3'} ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                            />
                            {!isCollapsed && (
                                <span className="flex-1 text-left">{item.label}</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
