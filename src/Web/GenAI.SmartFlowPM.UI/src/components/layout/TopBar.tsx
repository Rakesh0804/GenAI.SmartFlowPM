import React, { useState } from 'react';
import { BellIcon, SearchIcon, UserIcon, ChevronDownIcon } from 'lucide-react';

export const TopBar: React.FC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-2">
            <div className="flex items-center justify-between">
                {/* Search Section */}
                <div className="flex-1 max-w-lg">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects, tasks, team members..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <BellIcon size={20} />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                <UserIcon size={16} className="text-white" />
                            </div>
                            <div className="hidden md:block text-left">
                                <div className="text-sm font-medium">John Doe</div>
                                <div className="text-xs text-gray-500">Administrator</div>
                            </div>
                            <ChevronDownIcon size={16} className="text-gray-400" />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Profile Settings
                                </a>
                                <a href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Account Settings
                                </a>
                                <a href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Help & Support
                                </a>
                                <hr className="my-1" />
                                <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Sign Out
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
