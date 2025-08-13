'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    persistent?: boolean;
}

// Maximum number of toasts to show at once
const MAX_TOASTS = 3;

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    success: (title: string, message?: string, duration?: number) => string;
    error: (title: string, message?: string, persistent?: boolean) => string;
    warning: (title: string, message?: string, duration?: number) => string;
    info: (title: string, message?: string, duration?: number) => string;
    clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const getToastIcon = (type: ToastType) => {
    switch (type) {
        case 'success':
            return CheckCircle;
        case 'error':
            return AlertCircle;
        case 'warning':
            return AlertTriangle;
        case 'info':
        default:
            return Info;
    }
};

const getToastColors = (type: ToastType) => {
    switch (type) {
        case 'success':
            return {
                bg: 'bg-white border-l-4 border-l-emerald-500 shadow-lg shadow-emerald-100/50',
                icon: 'text-emerald-600',
                title: 'text-gray-800',
                close: 'text-gray-400 hover:text-gray-600'
            };
        case 'error':
            return {
                bg: 'bg-white border-l-4 border-l-red-500 shadow-lg shadow-red-100/50',
                icon: 'text-red-600',
                title: 'text-gray-800',
                close: 'text-gray-400 hover:text-gray-600'
            };
        case 'warning':
            return {
                bg: 'bg-white border-l-4 border-l-amber-500 shadow-lg shadow-amber-100/50',
                icon: 'text-amber-600',
                title: 'text-gray-800',
                close: 'text-gray-400 hover:text-gray-600'
            };
        case 'info':
        default:
            return {
                bg: 'bg-white border-l-4 border-l-blue-500 shadow-lg shadow-blue-100/50',
                icon: 'text-blue-600',
                title: 'text-gray-800',
                close: 'text-gray-400 hover:text-gray-600'
            };
    }
};

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const Icon = getToastIcon(toast.type);
    const colors = getToastColors(toast.type);

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setIsVisible(true), 100);

        // Auto-remove toast if not persistent
        if (!toast.persistent) {
            const duration = toast.duration || 5000;
            const timer = setTimeout(() => {
                handleRemove();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [toast.duration, toast.persistent]);

    const handleRemove = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onRemove(toast.id);
        }, 200);
    }, [toast.id, onRemove]);

    // Combine title and message into single line for sleek design
    const displayText = toast.message ? `${toast.title}: ${toast.message}` : toast.title;

    return (
        <div
            className={`
        relative w-full max-w-md rounded-lg backdrop-blur-sm transition-all duration-200 ease-out
        ${colors.bg}
        ${isVisible && !isExiting
                    ? 'opacity-100 translate-x-0 scale-100'
                    : 'opacity-0 translate-x-full scale-95'
                }
        ${isExiting ? 'opacity-0 translate-x-full scale-95' : ''}
      `}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-center px-4 py-3">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${colors.icon} font-bold stroke-2`} aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                    <p className={`text-sm font-medium ${colors.title} truncate`}>
                        {displayText}
                    </p>
                </div>
                <div className="ml-3 flex-shrink-0">
                    <button
                        type="button"
                        className={`
              inline-flex rounded-full p-1 transition-all duration-150 ease-out
              ${colors.close}
              hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300
            `}
                        onClick={handleRemove}
                        aria-label="Dismiss notification"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const generateId = () => {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
        const id = generateId();
        const newToast: Toast = {
            id,
            duration: 5000,
            ...toastData,
        };

        setToasts(prev => {
            // Smart queue management: prevent similar toasts and limit quantity
            const existingSimilar = prev.find(toast => 
                toast.type === newToast.type && 
                toast.title === newToast.title
            );

            // If similar toast exists, don't add duplicate
            if (existingSimilar) {
                return prev;
            }

            // Keep only most recent toasts (limit to MAX_TOASTS)
            const updatedToasts = [newToast, ...prev];
            if (updatedToasts.length > MAX_TOASTS) {
                // Remove oldest non-persistent toasts first
                const persistentToasts = updatedToasts.filter(t => t.persistent);
                const nonPersistentToasts = updatedToasts.filter(t => !t.persistent);
                
                const toastsToKeep = [
                    ...persistentToasts,
                    ...nonPersistentToasts.slice(0, MAX_TOASTS - persistentToasts.length)
                ];
                
                return toastsToKeep;
            }

            return updatedToasts;
        });
        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((title: string, message?: string, duration?: number) => {
        return addToast({ type: 'success', title, message, duration });
    }, [addToast]);

    const error = useCallback((title: string, message?: string, persistent?: boolean) => {
        return addToast({
            type: 'error',
            title,
            message,
            persistent,
            duration: persistent ? undefined : 6000 // Slightly longer for errors
        });
    }, [addToast]);

    const warning = useCallback((title: string, message?: string, duration?: number) => {
        return addToast({ type: 'warning', title, message, duration });
    }, [addToast]);

    const info = useCallback((title: string, message?: string, duration?: number) => {
        return addToast({ type: 'info', title, message, duration });
    }, [addToast]);

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider value={{
            toasts,
            addToast,
            removeToast,
            success,
            error,
            warning,
            info,
            clearAll
        }}>
            {children}

            {/* Modern Toast Container */}
            <div
                className="fixed top-6 right-6 z-50 space-y-3 max-w-md w-full pointer-events-none"
                aria-live="polite"
                aria-label="Notifications"
            >
                {toasts.map((toast, index) => (
                    <div 
                        key={toast.id}
                        className="pointer-events-auto"
                        style={{ 
                            zIndex: 1000 - index // Ensure proper stacking
                        }}
                    >
                        <ToastItem
                            toast={toast}
                            onRemove={removeToast}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
