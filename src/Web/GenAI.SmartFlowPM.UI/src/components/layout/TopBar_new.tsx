'use client';

import React, { useState, useEffect } from 'react';
import { BellIcon, SearchIcon, UserIcon, LogOutIcon, ChevronDownIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { enhancedTokenManager } from '../../lib/cookieManager';
import { useRouter } from 'next/navigation';

// Client-side check
const isClient = typeof window !== 'undefined';

export const TopBar: React.FC = () => {
    const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { user, isAuthenticated, refreshUser, logout } = useAuth();
    const router = isClient ? useRouter() : null;

    // Helper functions for user display
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

    const handleProfileClick = () => {
        setShowProfileMenu(false);
        if (router) {
            router.push('/profile');
        }
    };

    // Monitor token expiration
    useEffect(() => {
        const checkTokenExpiration = () => {
            const expiry = enhancedTokenManager.getTokenExpiration();
            setTokenExpiry(expiry);

            if (expiry) {
                const timeUntilExpiry = expiry.getTime() - Date.now();
                const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

                // Show warning if token expires in less than 5 minutes
                if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
                    console.warn('Token expiring soon, consider refreshing');
                    // Optionally show a toast notification here
                }
            }
        };

        // Check immediately
        checkTokenExpiration();

        // Set up interval to check every minute
        const interval = setInterval(checkTokenExpiration, 60000);

        return () => clearInterval(interval);
    }, [user]);

    // Auto-refresh user data periodically
    useEffect(() => {
        if (isAuthenticated && enhancedTokenManager.isTokenValid()) {
            const refreshInterval = setInterval(() => {
                refreshUser().catch(console.error);
            }, 15 * 60 * 1000); // Refresh every 15 minutes

            return () => clearInterval(refreshInterval);
        }
    }, [isAuthenticated, refreshUser]);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (showProfileMenu && !target.closest('.profile-menu-container')) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showProfileMenu]);

    return (
        <header className="bg-gradient-to-r from-primary-500 to-primary-600 border-b border-primary-400/30 px-6 py-1.5 shadow-lg backdrop-blur-sm relative z-50">
            <div className="flex items-center justify-between">
                {/* Search Section */}
                <div className="flex-1 max-w-lg">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80 z-10" size={18} />
                        <input
                            id="global-search-input"
                            name="globalSearch"
                            type="text"
                            placeholder="Search projects, tasks, team members..."
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            data-form-type="other"
                            data-lpignore="true"
                            className="w-full pl-10 pr-4 py-1.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder-white/60 backdrop-blur-sm"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-3">
                    {/* Token Expiry Indicator (dev only) */}
                    {process.env.NODE_ENV === 'development' && tokenExpiry && (
                        <div className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded">
                            Expires: {tokenExpiry.toLocaleTimeString()}
                        </div>
                    )}

                    {/* Notifications */}
                    <button className="relative p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                        <BellIcon size={18} />
                        {/* Fixed notification badge with better visibility */}
                        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full ring-2 ring-white text-white text-xs font-bold flex items-center justify-center">
                            3
                        </span>
                    </button>

                    {/* User Profile - Avatar Only */}
                    {isAuthenticated && (
                        <div className="relative profile-menu-container">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                                title={getUserDisplayName()}
                            >
                                {/* Avatar with bold initials */}
                                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center ring-2 ring-white/10 hover:ring-white/20 transition-all duration-200">
                                    <span className="font-bold text-white text-sm">
                                        {getUserInitials()}
                                    </span>
                                </div>
                                <ChevronDownIcon 
                                    size={14} 
                                    className={`text-white/70 group-hover:text-white transition-all duration-200 ${
                                        showProfileMenu ? 'rotate-180' : ''
                                    }`} 
                                />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {showProfileMenu && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-[100000] border border-gray-200">
                                    {/* User Info Header */}
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center">
                                                <span className="font-bold text-primary-700 text-sm">
                                                    {getUserInitials()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold text-gray-900 truncate">
                                                    {getUserDisplayName()}
                                                </div>
                                                <div className="text-xs text-gray-600 truncate">
                                                    {user?.email || 'No email'}
                                                </div>
                                                <div className="text-xs text-primary-600 font-medium">
                                                    {getUserRole()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Menu Items */}
                                    <button
                                        onClick={handleProfileClick}
                                        className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <UserIcon size={16} className="mr-3 flex-shrink-0 text-gray-500" />
                                        Profile Settings
                                    </button>
                                    
                                    <div className="border-t border-gray-200 my-1"></div>
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                    >
                                        <LogOutIcon size={16} className="mr-3 flex-shrink-0" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
