// Health Check Hook for monitoring API status
'use client';

import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '@/lib/http-client';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  checks: HealthCheck[];
  totalDuration: string;
  entries: Record<string, HealthCheckEntry>;
}

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  description?: string;
  data?: Record<string, any>;
  duration: string;
  exception?: string;
}

export interface HealthCheckEntry {
  data: Record<string, any>;
  description: string;
  duration: string;
  exception: string | null;
  status: 'healthy' | 'degraded' | 'unhealthy';
  tags: string[];
}

export interface UseHealthCheckOptions {
  interval?: number; // Polling interval in milliseconds
  autoStart?: boolean;
  onStatusChange?: (status: HealthStatus) => void;
  onError?: (error: Error) => void;
}

export function useHealthCheck(options: UseHealthCheckOptions = {}) {
  const {
    interval = 30000, // 30 seconds default
    autoStart = true,
    onStatusChange,
    onError
  } = options;

  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const client = httpClient.getClient('healthCheck');
      const response = await client.get<HealthStatus>('/health');
      
      const healthStatus = response.data;
      setStatus(healthStatus);
      setLastCheck(new Date());
      
      if (onStatusChange) {
        onStatusChange(healthStatus);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Health check failed');
      setError(error);
      
      if (onError) {
        onError(error);
      }

      // Set unknown status on error
      setStatus({
        status: 'unknown',
        checks: [],
        totalDuration: '0ms',
        entries: {}
      });
    } finally {
      setIsLoading(false);
    }
  }, [onStatusChange, onError]);

  const checkReadiness = useCallback(async () => {
    try {
      const client = httpClient.getClient('healthCheck');
      const response = await client.get<HealthStatus>('/health/ready');
      return response.data.status === 'healthy';
    } catch {
      return false;
    }
  }, []);

  const checkLiveness = useCallback(async () => {
    try {
      const client = httpClient.getClient('healthCheck');
      const response = await client.get<HealthStatus>('/health/live');
      return response.data.status === 'healthy';
    } catch {
      return false;
    }
  }, []);

  // Auto-polling effect
  useEffect(() => {
    if (!autoStart) return;

    // Initial check
    checkHealth();

    // Set up polling
    const intervalId = setInterval(checkHealth, interval);

    return () => clearInterval(intervalId);
  }, [autoStart, interval, checkHealth]);

  const getOverallHealthStatus = useCallback(() => {
    if (!status) return 'unknown';
    return status.status;
  }, [status]);

  const getFailedChecks = useCallback(() => {
    if (!status) return [];
    return status.checks.filter((check: HealthCheck) => check.status !== 'healthy');
  }, [status]);

  const getDegradedChecks = useCallback(() => {
    if (!status) return [];
    return status.checks.filter((check: HealthCheck) => check.status === 'degraded');
  }, [status]);

  const getHealthySummary = useCallback(() => {
    if (!status) return { healthy: 0, total: 0, percentage: 0 };
    
    const healthy = status.checks.filter((check: HealthCheck) => check.status === 'healthy').length;
    const total = status.checks.length;
    const percentage = total > 0 ? Math.round((healthy / total) * 100) : 0;
    
    return { healthy, total, percentage };
  }, [status]);

  return {
    status,
    isLoading,
    error,
    lastCheck,
    checkHealth,
    checkReadiness,
    checkLiveness,
    getOverallHealthStatus,
    getFailedChecks,
    getDegradedChecks,
    getHealthySummary
  };
}
