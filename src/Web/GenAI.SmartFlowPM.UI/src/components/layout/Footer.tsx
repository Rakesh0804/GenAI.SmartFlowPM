import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-primary-200/50 px-6 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                    <span>© 2025 Flow.</span>
                    <span>All rights reserved.</span>
                </div>

                <div className="flex items-center space-x-6 mt-2 md:mt-0">
                    <a href="/privacy" className="hover:text-primary-600 transition-colors duration-200">
                        Privacy Policy
                    </a>
                    <a href="/terms" className="hover:text-primary-600 transition-colors duration-200">
                        Terms of Service
                    </a>
                    <a href="/support" className="hover:text-primary-600 transition-colors duration-200">
                        Support
                    </a>
                    <span className="text-xs text-slate-500 bg-slate-200/50 px-2 py-1 rounded-full">
                        v1.0.0
                    </span>
                </div>
            </div>
        </footer>
    );
};
