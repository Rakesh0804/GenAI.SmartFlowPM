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
    SettingsIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    LucideIcon,
    ShieldIcon,
    KeyIcon,
    BuildingIcon,
    ServerIcon,
    MegaphoneIcon,
    AwardIcon
} from 'lucide-react';

// Client-side check
const isClient = typeof window !== 'undefined';

interface SubMenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    href: string;
    badge?: number;
}

interface MenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    href?: string;
    badge?: number;
    subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
    { id: 'home', label: 'Home', icon: HomeIcon, href: '/dashboard' },
    { 
        id: 'projects', 
        label: 'Projects', 
        icon: FolderIcon, 
        href: '/projects',
        subItems: [
            { id: 'project-cockpit', label: 'Project Cockpit', icon: BarChart3Icon, href: '/projects/cockpit' },
            { id: 'tasks', label: 'Tasks', icon: CheckSquareIcon, href: '/projects/tasks', badge: 12 }
        ]
    },
    { 
        id: 'manage', 
        label: 'Manage', 
        icon: SettingsIcon,
        subItems: [
            { id: 'tenants', label: 'Tenants', icon: ServerIcon, href: '/manage/tenants' },
            { id: 'organizations', label: 'Organizations', icon: BuildingIcon, href: '/manage/organizations' },
            { id: 'users', label: 'Users', icon: UsersIcon, href: '/manage/users' },
            { id: 'roles', label: 'Roles', icon: ShieldIcon, href: '/manage/roles' },
            { id: 'claims', label: 'Claims', icon: KeyIcon, href: '/manage/claims' }
        ]
    },
    { 
        id: 'teams', 
        label: 'Teams', 
        icon: UsersIcon, 
        href: '/teams',
        subItems: [
            { id: 'team-cockpit', label: 'Team Cockpit', icon: BarChart3Icon, href: '/teams/cockpit' },
            { id: 'new-team', label: 'Create Team', icon: UsersIcon, href: '/teams/new' }
        ]
    },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, href: '/calendar' },
    { id: 'timetracker', label: 'Time Tracker', icon: ClockIcon, href: '/timetracker' },
    { id: 'attendance', label: 'Attendance', icon: UserCheckIcon, href: '/attendance' },
    { id: 'files', label: 'Files', icon: FileIcon, href: '/files' },
    { id: 'travel', label: 'Travel', icon: MapIcon, href: '/travel' },
    { id: 'compensation', label: 'Compensation', icon: DollarSignIcon, href: '/compensation' },
    { id: 'reports', label: 'Reports', icon: BarChart3Icon, href: '/reports' },
    { id: 'chat', label: 'Chat', icon: MessageSquareIcon, href: '/chat', badge: 3 },
    { 
        id: 'campaign', 
        label: 'Campaign', 
        icon: MegaphoneIcon,
        subItems: [
            { id: 'campaign-dashboard', label: 'Dashboard', icon: BarChart3Icon, href: '/campaigns/dashboard' },
            { id: 'campaign-cockpit', label: 'Cockpit', icon: SettingsIcon, href: '/campaigns/cockpit' },
            { id: 'campaign-groups', label: 'Groups', icon: UsersIcon, href: '/campaigns/groups' }
        ]
    },
    { id: 'certificate', label: 'Certificate', icon: AwardIcon, href: '/certificate' },
];

export const Sidebar: React.FC = () => {
    const { isCollapsed, toggleSidebar } = useSidebar();
    const [mounted, setMounted] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
    const router = isClient ? useRouter() : null;
    const pathname = isClient ? usePathname() : '';

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNavigation = (href: string) => {
        if (!router || !mounted) return;
        router.push(href);
    };

    const toggleMenu = (menuId: string) => {
        const newExpanded = new Set(expandedMenus);
        if (newExpanded.has(menuId)) {
            newExpanded.delete(menuId);
        } else {
            newExpanded.add(menuId);
        }
        setExpandedMenus(newExpanded);
    };

    const isActive = (href: string) => {
        if (!mounted) return false;
        return pathname === href || (href === '/dashboard' && pathname === '/');
    };

    const isMenuActive = (item: MenuItem): boolean => {
        if (item.href && isActive(item.href)) return true;
        if (item.subItems) {
            return item.subItems.some(subItem => isActive(subItem.href));
        }
        return false;
    };

    // Don't render until mounted on client to avoid hydration issues
    if (!mounted) {
        return (
            <div className="fixed left-0 top-0 h-full w-64 border-r border-orange-200 z-50" style={{backgroundColor: '#FFF8F0'}}>
                <div className="p-4">
                    <div className="h-8 bg-orange-100 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`fixed left-0 top-0 h-full border-r border-orange-200 transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-16' : 'w-64'
                }`} style={{backgroundColor: '#FFF8F0', overflowY: 'auto'}}>
            {/* Header */}
            <div className={`flex items-center p-4 border-b border-orange-200/50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <div className={`flex items-center space-x-3 transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center ring-1 ring-orange-200 shadow-sm">
                            <img 
                                src="/images/flow-logo-transparent.png" 
                                alt="SmartFlowPM Logo" 
                                className="w-6 h-6 object-contain"
                            />
                        </div>
                        <span className={`font-bold text-secondary-800 text-lg transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                            }`}>
                            Flow
                        </span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center ring-1 ring-orange-200 shadow-sm">
                        <img 
                            src="/images/flow-logo-transparent.png" 
                            alt="SmartFlowPM Logo" 
                            className="w-5 h-5 object-contain"
                        />
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-md hover:bg-orange-100 text-secondary-600 hover:text-secondary-800 transition-colors duration-200 flex-shrink-0"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
                    const active = isMenuActive(item);
                    const isExpanded = expandedMenus.has(item.id);
                    const hasSubItems = item.subItems && item.subItems.length > 0;

                    return (
                        <div key={item.id}>
                            {/* Main Menu Item */}
                            <button
                                onClick={() => {
                                    if (hasSubItems) {
                                        toggleMenu(item.id);
                                    } else if (item.href) {
                                        handleNavigation(item.href);
                                    }
                                }}
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group ${
                                    active
                                        ? 'bg-primary-500 text-white backdrop-blur-sm border-r-2 border-primary-600 shadow-lg'
                                        : 'text-secondary-700 hover:text-secondary-900 hover:bg-primary-50'
                                }`}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon
                                    size={20}
                                    className={`${isCollapsed ? 'mx-auto' : 'mr-3'} transition-all duration-200 ease-in-out ${
                                        active ? 'text-white' : 'text-secondary-600 group-hover:text-secondary-800'
                                    }`}
                                />
                                <div className={`flex items-center justify-between flex-1 transition-all duration-300 ease-in-out overflow-hidden ${
                                    isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                                }`}>
                                    <span className="text-left whitespace-nowrap">{item.label}</span>
                                    <div className="flex items-center space-x-2">
                                        {item.badge && (
                                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-500 rounded-full shadow-sm">
                                                {item.badge}
                                            </span>
                                        )}
                                        {hasSubItems && !isCollapsed && (
                                            <div className="transition-transform duration-200">
                                                {isExpanded ? (
                                                    <ChevronUpIcon size={16} className="text-secondary-500" />
                                                ) : (
                                                    <ChevronDownIcon size={16} className="text-secondary-500" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* Sub Menu Items */}
                            {hasSubItems && isExpanded && !isCollapsed && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {item.subItems?.map((subItem) => {
                                        const SubIcon = subItem.icon;
                                        const subActive = isActive(subItem.href);

                                        return (
                                            <button
                                                key={subItem.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNavigation(subItem.href);
                                                }}
                                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group ${
                                                    subActive
                                                        ? 'bg-primary-500 text-white backdrop-blur-sm border-l-2 border-primary-600 shadow-lg'
                                                        : 'text-secondary-600 hover:text-secondary-800 hover:bg-primary-50'
                                                }`}
                                            >
                                                <SubIcon
                                                    size={18}
                                                    className={`mr-3 transition-all duration-200 ease-in-out ${
                                                        subActive ? 'text-white' : 'text-secondary-600 group-hover:text-secondary-800'
                                                    }`}
                                                />
                                                <div className="flex items-center justify-between flex-1">
                                                    <span className="text-left whitespace-nowrap">{subItem.label}</span>
                                                    {subItem.badge && (
                                                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-500 rounded-full shadow-sm">
                                                            {subItem.badge}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
        
        {/* Floating Expand Button - Only visible when collapsed */}
        {isCollapsed && (
            <button
                onClick={toggleSidebar}
                className="fixed left-2 top-20 z-60 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                title="Expand sidebar"
            >
                <ChevronRightIcon size={16} />
            </button>
        )}
        </>
    );
};
