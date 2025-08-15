'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../hooks/useAuth';
import { enhancedTokenManager } from '../../lib/cookieManager';
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
    ChevronDownIcon,
    ChevronUpIcon,
    LucideIcon,
    UserIcon,
    ShieldIcon,
    KeyIcon,
    BuildingIcon,
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
            { id: 'tasks', label: 'Tasks', icon: CheckSquareIcon, href: '/projects/tasks', badge: 12 }
        ]
    },
    { 
        id: 'manage', 
        label: 'Manage', 
        icon: SettingsIcon,
        subItems: [
            { id: 'tenants', label: 'Tenants', icon: BuildingIcon, href: '/manage/tenants' },
            { id: 'organizations', label: 'Organizations', icon: BuildingIcon, href: '/manage/organizations' },
            { id: 'users', label: 'Users', icon: UsersIcon, href: '/manage/users' },
            { id: 'roles', label: 'Roles', icon: ShieldIcon, href: '/manage/roles' },
            { id: 'claims', label: 'Claims', icon: KeyIcon, href: '/manage/claims' }
        ]
    },
    { id: 'team', label: 'Team', icon: UsersIcon, href: '/team' },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, href: '/calendar' },
    { id: 'timetracker', label: 'Time Tracker', icon: ClockIcon, href: '/timetracker' },
    { id: 'attendance', label: 'Attendance', icon: UserCheckIcon, href: '/attendance' },
    { id: 'files', label: 'Files', icon: FileIcon, href: '/files' },
    { id: 'travel', label: 'Travel', icon: MapIcon, href: '/travel' },
    { id: 'compensation', label: 'Compensation', icon: DollarSignIcon, href: '/compensation' },
    { id: 'reports', label: 'Reports', icon: BarChart3Icon, href: '/reports' },
    { id: 'chat', label: 'Chat', icon: MessageSquareIcon, href: '/chat', badge: 3 },
    { id: 'campaign', label: 'Campaign', icon: MegaphoneIcon, href: '/campaign' },
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
            <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-primary-600 to-primary-700 border-r border-primary-500 z-50">
                <div className="p-4">
                    <div className="h-8 bg-white/20 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-primary-600 to-primary-700 border-r border-primary-500 transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-16' : 'w-64'
                }`}>
            {/* Header */}
            <div className={`flex items-center p-4 border-b border-primary-500/30 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <div className={`flex items-center space-x-2 transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center ring-1 ring-white/30">
                            <span className="text-white font-bold text-sm">SF</span>
                        </div>
                        <span className={`font-bold text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                            }`}>
                            SmartFlowPM
                        </span>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors duration-200 flex-shrink-0"
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
                                        ? 'bg-white/20 text-white backdrop-blur-sm border-r-2 border-white/50 shadow-lg'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon
                                    size={20}
                                    className={`${isCollapsed ? 'mx-auto' : 'mr-3'} transition-all duration-200 ease-in-out ${
                                        active ? 'text-white' : 'text-white/70 group-hover:text-white'
                                    }`}
                                />
                                <div className={`flex items-center justify-between flex-1 transition-all duration-300 ease-in-out overflow-hidden ${
                                    isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                                }`}>
                                    <span className="text-left whitespace-nowrap">{item.label}</span>
                                    <div className="flex items-center space-x-2">
                                        {item.badge && (
                                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-600 bg-white rounded-full shadow-sm">
                                                {item.badge}
                                            </span>
                                        )}
                                        {hasSubItems && !isCollapsed && (
                                            <div className="transition-transform duration-200">
                                                {isExpanded ? (
                                                    <ChevronUpIcon size={16} className="text-white/70" />
                                                ) : (
                                                    <ChevronDownIcon size={16} className="text-white/70" />
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
                                                onClick={() => handleNavigation(subItem.href)}
                                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group ${
                                                    subActive
                                                        ? 'bg-white/20 text-white backdrop-blur-sm border-l-2 border-white/50 shadow-lg'
                                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                                }`}
                                            >
                                                <SubIcon
                                                    size={18}
                                                    className={`mr-3 transition-all duration-200 ease-in-out ${
                                                        subActive ? 'text-white' : 'text-white/60 group-hover:text-white'
                                                    }`}
                                                />
                                                <div className="flex items-center justify-between flex-1">
                                                    <span className="text-left whitespace-nowrap">{subItem.label}</span>
                                                    {subItem.badge && (
                                                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-600 bg-white rounded-full shadow-sm">
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

            {/* User Profile Section - Replaces Bottom Navigation */}
            <div className="border-t border-primary-500/30 px-2 py-4">
                <UserProfileSection isCollapsed={isCollapsed} />
            </div>
        </div>
        
        {/* Floating Expand Button - Only visible when collapsed */}
        {isCollapsed && (
            <button
                onClick={toggleSidebar}
                className="fixed left-2 top-20 z-60 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                title="Expand sidebar"
            >
                <ChevronRightIcon size={16} />
            </button>
        )}
        </>
    );
};

// User Profile Section Component
const UserProfileSection: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const getUserDisplayName = () => {
        if (!user) return 'Guest User';
        return user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.email || 'Unknown User';
    };

    const getUserInitials = () => {
        if (!user) return 'GU';
        if (user.firstName && user.lastName) {
            return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
        }
        if (user.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return 'SA';
    };

    const getUserRole = () => {
        if (!user) return 'Guest';
        
        // Try to get role from token
        try {
            const token = enhancedTokenManager.getToken();
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                if (role) return role;
            }
        } catch (error) {
            console.warn('Could not parse role from token:', error);
        }
        
        // Fallback to default
        return 'User';
    };

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
    };

    return (
        <div className="relative">
            {/* User Info Display - Styled like other menu items */}
            <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group text-white/70 hover:text-white hover:bg-white/10 ${
                    isCollapsed ? 'justify-center' : ''
                } ${showProfileMenu ? 'bg-white/20 text-white backdrop-blur-sm' : ''}`}
                title={isCollapsed ? getUserDisplayName() : undefined}
            >
                <div className="w-5 h-5 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-1 ring-white/30 flex-shrink-0">
                    <span className="text-white font-medium text-xs">
                        {getUserInitials()}
                    </span>
                </div>
                
                {/* Only show text when expanded */}
                {!isCollapsed && (
                    <div className={`flex-1 text-left transition-all duration-300 ease-in-out overflow-hidden ml-3`}>
                        <div className="text-sm font-medium text-white truncate">
                            {getUserDisplayName()}
                        </div>
                        <div className="text-xs text-white/70 truncate">
                            {getUserRole()}
                        </div>
                    </div>
                )}
            </button>

            {/* Profile Menu Dropdown - Only show when expanded and menu is open */}
            {showProfileMenu && !isCollapsed && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                        <div className="text-sm font-medium text-gray-900 truncate">
                            {getUserDisplayName()}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                            {user?.email || 'No email'}
                        </div>
                    </div>
                    
                    <button
                        onClick={() => {
                            setShowProfileMenu(false);
                            // Navigate to profile page
                            window.location.href = '/profile';
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                        <UserIcon size={16} className="mr-3 flex-shrink-0" />
                        Profile Settings
                    </button>
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                        <LogOutIcon size={16} className="mr-3 flex-shrink-0" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};
