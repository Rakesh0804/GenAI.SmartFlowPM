'use client';

import { useEffect } from 'react';
import { generateTestTrace } from '../lib/tracing';

export default function TracingComponent() {
  useEffect(() => {
    // Generate initial test traces when the app loads
    console.log('🚀 Frontend app loaded, generating test traces...');
    
    generateTestTrace('frontend.app.startup', {
      'app.version': '1.0.0',
      'environment': process.env.NODE_ENV || 'development',
    });

    // Generate periodic test traces every 30 seconds
    const interval = setInterval(() => {
      generateTestTrace('frontend.app.heartbeat', {
        'heartbeat.timestamp': new Date().toISOString(),
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
}
