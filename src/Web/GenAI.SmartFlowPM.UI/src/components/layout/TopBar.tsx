import React, { useState, useEffect } from 'react';
import { BellIcon, SearchIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { enhancedTokenManager } from '../../lib/cookieManager';

export const TopBar: React.FC = () => {
    const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
    const { user, isAuthenticated, refreshUser } = useAuth();

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

    return (
        <header className="bg-gradient-to-r from-primary-500 to-primary-600 border-b border-primary-400/30 px-6 py-1.5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
                {/* Search Section */}
                <div className="flex-1 max-w-lg">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80 z-10" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects, tasks, team members..."
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
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-400 rounded-full ring-2 ring-white/30"></span>
                    </button>
                </div>
            </div>
        </header>
    );
};
