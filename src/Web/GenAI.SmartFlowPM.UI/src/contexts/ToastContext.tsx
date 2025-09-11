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
    correlationId?: string;
    details?: string;
    validationErrors?: Array<{ field: string; messages: string[] }>;
}

// Maximum number of toasts to show at once
const MAX_TOASTS = 3;

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    success: (title: string, message?: string, duration?: number) => string;
    error: (title: string, message?: string, persistent?: boolean, correlationId?: string, details?: string) => string;
    warning: (title: string, message?: string, duration?: number) => string;
    info: (title: string, message?: string, duration?: number) => string;
    clearAll: () => void;
    // Enhanced method for processed errors
    showProcessedError: (processedError: any) => string;
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
                bg: 'bg-emerald-50 border border-emerald-200 shadow-lg shadow-emerald-100/50',
                iconBox: 'bg-emerald-500',
                icon: 'text-white',
                title: 'text-emerald-800',
                message: 'text-emerald-700',
                close: 'text-emerald-400 hover:text-emerald-600',
                divider: 'border-emerald-200'
            };
        case 'error':
            return {
                bg: 'bg-red-50 border border-red-200 shadow-lg shadow-red-100/50',
                iconBox: 'bg-red-500',
                icon: 'text-white',
                title: 'text-red-800',
                message: 'text-red-700',
                close: 'text-red-400 hover:text-red-600',
                divider: 'border-red-200'
            };
        case 'warning':
            return {
                bg: 'bg-amber-50 border border-amber-200 shadow-lg shadow-amber-100/50',
                iconBox: 'bg-amber-500',
                icon: 'text-white',
                title: 'text-amber-800',
                message: 'text-amber-700',
                close: 'text-amber-400 hover:text-amber-600',
                divider: 'border-amber-200'
            };
        case 'info':
        default:
            return {
                bg: 'bg-blue-50 border border-blue-200 shadow-lg shadow-blue-100/50',
                iconBox: 'bg-blue-500',
                icon: 'text-white',
                title: 'text-blue-800',
                message: 'text-blue-700',
                close: 'text-blue-400 hover:text-blue-600',
                divider: 'border-blue-200'
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

    // Don't combine title and message - show them separately for better clarity
    const hasMessage = toast.message && toast.message.trim() !== '';

    return (
        <div
            className={`
        relative w-full max-w-md rounded-lg backdrop-blur-sm transition-all duration-200 ease-out overflow-hidden
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
            <div className="flex items-stretch min-h-[60px]">
                {/* Square Icon Box */}
                <div className={`flex-shrink-0 w-12 ${colors.iconBox} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${colors.icon} font-bold stroke-2`} aria-hidden="true" />
                </div>
                
                {/* Divider Line */}
                <div className={`w-px ${colors.divider} border-l`}></div>
                
                {/* Content Area */}
                <div className="flex-1 min-w-0 px-4 py-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${colors.title} leading-tight`}>
                                {toast.title}
                            </p>
                            {hasMessage && (
                                <p className={`text-sm ${colors.message} mt-1 leading-tight`}>
                                    {toast.message}
                                </p>
                            )}
                            
                            {/* Validation Errors */}
                            {toast.validationErrors && toast.validationErrors.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {toast.validationErrors.map((error, index) => (
                                        <div key={index} className={`text-xs ${colors.message} bg-white/30 rounded px-2 py-1`}>
                                            <span className="font-medium">{error.field}:</span> {error.messages.join(', ')}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Details */}
                            {toast.details && (
                                <p className={`text-xs ${colors.message} mt-2 opacity-80`}>
                                    {toast.details}
                                </p>
                            )}

                            {/* Correlation ID for debugging (only in development) */}
                            {toast.correlationId && process.env.NODE_ENV === 'development' && (
                                <p className={`text-xs ${colors.message} mt-1 opacity-60 font-mono`}>
                                    ID: {toast.correlationId.slice(-8)}
                                </p>
                            )}
                        </div>
                        <div className="ml-3 flex-shrink-0">
                            <button
                                type="button"
                                className={`
                  inline-flex rounded-full p-1 transition-all duration-150 ease-out
                  ${colors.close}
                  hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30
                `}
                                onClick={handleRemove}
                                aria-label="Dismiss notification"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
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

    const error = useCallback((title: string, message?: string, persistent?: boolean, correlationId?: string, details?: string) => {
        return addToast({
            type: 'error',
            title,
            message,
            persistent,
            correlationId,
            details,
            duration: persistent ? undefined : 6000 // Slightly longer for errors
        });
    }, [addToast]);

    const showProcessedError = useCallback((processedError: any) => {
        return addToast({
            type: 'error',
            title: processedError.title || 'Error',
            message: processedError.message,
            correlationId: processedError.correlationId,
            details: processedError.details,
            validationErrors: processedError.validationErrors,
            persistent: !processedError.isRetryable,
            duration: processedError.isRetryable ? 6000 : undefined
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
            clearAll,
            showProcessedError
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
