import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                    <span>© 2025 SmartFlowPM.</span>
                    <span>All rights reserved.</span>
                </div>

                <div className="flex items-center space-x-6 mt-2 md:mt-0">
                    <a href="/privacy" className="hover:text-gray-700 transition-colors">
                        Privacy Policy
                    </a>
                    <a href="/terms" className="hover:text-gray-700 transition-colors">
                        Terms of Service
                    </a>
                    <a href="/support" className="hover:text-gray-700 transition-colors">
                        Support
                    </a>
                    <span className="text-xs">
                        v1.0.0
                    </span>
                </div>
            </div>
        </footer>
    );
};
