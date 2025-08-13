'use client';

import { useToast } from '../../contexts/ToastContext';

export default function ToastDemoPage() {
    const { success, error, warning, info, clearAll } = useToast();

    const demonstrations = [
        {
            type: 'success',
            title: 'Success Notifications',
            examples: [
                {
                    label: 'Simple Success',
                    action: () => success('Success!', 'Operation completed successfully')
                },
                {
                    label: 'Save Success',
                    action: () => success('Data Saved', 'Your changes have been saved successfully', 3000)
                },
                {
                    label: 'Upload Success',
                    action: () => success('File Uploaded', 'document.pdf has been uploaded to your workspace')
                }
            ]
        },
        {
            type: 'error',
            title: 'Error Notifications',
            examples: [
                {
                    label: 'Simple Error',
                    action: () => error('Error occurred!', 'Something went wrong with your request')
                },
                {
                    label: 'Persistent Error',
                    action: () => error('Critical Error', 'Database connection failed. Please contact support.', true)
                },
                {
                    label: 'Validation Error',
                    action: () => error('Validation Failed', 'Please check your input and try again')
                }
            ]
        },
        {
            type: 'warning',
            title: 'Warning Notifications',
            examples: [
                {
                    label: 'Simple Warning',
                    action: () => warning('Warning!', 'Please check your input before proceeding')
                },
                {
                    label: 'Session Warning',
                    action: () => warning('Session Expiring', 'Your session will expire in 5 minutes', 10000)
                },
                {
                    label: 'Storage Warning',
                    action: () => warning('Storage Almost Full', 'You have used 95% of your storage quota')
                }
            ]
        },
        {
            type: 'info',
            title: 'Information Notifications',
            examples: [
                {
                    label: 'Simple Info',
                    action: () => info('Information', 'Here is some useful information for you')
                },
                {
                    label: 'Feature Info',
                    action: () => info('New Feature Available', 'Check out our new project template feature')
                },
                {
                    label: 'System Info',
                    action: () => info('System Maintenance', 'Scheduled maintenance will occur tonight at 2 AM EST', 8000)
                }
            ]
        }
    ];

    const getButtonColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-600 hover:bg-green-700 border-green-600';
            case 'error':
                return 'bg-red-600 hover:bg-red-700 border-red-600';
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600';
            case 'info':
                return 'bg-blue-600 hover:bg-blue-700 border-blue-600';
            default:
                return 'bg-gray-600 hover:bg-gray-700 border-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Toast Notification System Demo
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Interactive demonstration of our comprehensive toast notification system with icons, colors, and animations.
                    </p>

                    <div className="flex justify-center space-x-4 mb-8">
                        <button
                            onClick={clearAll}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Clear All Toasts
                        </button>
                        <button
                            onClick={() => {
                                // Test multiple error scenarios to showcase smart queue management
                                error('Connection Failed', 'Unable to connect to server');
                                setTimeout(() => error('Validation Error', 'Please check your input'), 100);
                                setTimeout(() => error('Authentication Failed', 'Invalid credentials'), 200);
                                setTimeout(() => error('Network Timeout', 'Request timed out'), 300);
                                setTimeout(() => error('Server Error', 'Internal server error'), 400);
                            }}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Test Multiple Errors (Smart Queue)
                        </button>
                        <button
                            onClick={() => {
                                success('Test Success');
                                error('Test Error');
                                warning('Test Warning');
                                info('Test Info');
                            }}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Show All Types
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {demonstrations.map((demo) => (
                        <div
                            key={demo.type}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-3 ${demo.type === 'success' ? 'bg-green-500' :
                                        demo.type === 'error' ? 'bg-red-500' :
                                            demo.type === 'warning' ? 'bg-yellow-500' :
                                                'bg-blue-500'
                                    }`}></span>
                                {demo.title}
                            </h2>
                            <div className="space-y-3">
                                {demo.examples.map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={example.action}
                                        className={`
                      w-full px-4 py-3 text-white rounded-md transition-colors 
                      border-2 text-left font-medium
                      ${getButtonColor(demo.type)}
                    `}
                                    >
                                        {example.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Features & Specifications
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Visual Features</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Distinctive icons for each toast type</li>
                                <li>• Color-coded notifications (green, red, yellow, blue)</li>
                                <li>• Smooth entrance and exit animations</li>
                                <li>• Responsive design for all screen sizes</li>
                                <li>• Clean, professional styling</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Functional Features</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Auto-dismiss with configurable duration</li>
                                <li>• Persistent notifications for critical errors</li>
                                <li>• Manual dismiss with close button</li>
                                <li>• Stack management with proper z-index</li>
                                <li>• Accessibility support (ARIA labels)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Usage Instructions
                    </h3>
                    <p className="text-blue-800 mb-4">
                        Import the <code className="bg-blue-100 px-1 rounded">useToast</code> hook in any component and call the appropriate method:
                    </p>
                    <div className="bg-blue-100 rounded-md p-4 font-mono text-sm text-blue-900">
                        <div>const &#123; success, error, warning, info &#125; = useToast();</div>
                        <div className="mt-2">success('Title', 'Optional message', duration);</div>
                        <div>error('Title', 'Optional message', persistent);</div>
                        <div>warning('Title', 'Optional message', duration);</div>
                        <div>info('Title', 'Optional message', duration);</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
