import { trace } from '@opentelemetry/api';

// Get the tracer for frontend operations
const tracer = trace.getTracer('frontend-tracer', '1.0.0');

/**
 * Generate a test trace to verify OpenTelemetry is working
 */
export function generateTestTrace(operationName: string, attributes?: Record<string, string>) {
  console.log('🔍 Generating test trace:', operationName);
  
  const span = tracer.startSpan(operationName, {
    kind: 1, // CLIENT
    attributes: {
      'service.name': 'frontend',
      'operation.type': 'test',
      ...attributes,
    },
  });

  // Simulate some work
  setTimeout(() => {
    span.setAttributes({
      'operation.completed': true,
      'timestamp': new Date().toISOString(),
    });
    
    console.log('✅ Test trace completed:', operationName);
    span.end();
  }, 100);
}

/**
 * Wrap API calls with tracing
 */
export function traceApiCall<T>(
  operationName: string,
  apiCall: () => Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const span = tracer.startSpan(`api.${operationName}`, {
      kind: 3, // CLIENT
      attributes: {
        'service.name': 'frontend',
        'operation.type': 'api_call',
        'api.operation': operationName,
      },
    });

    console.log('🌐 Starting API trace:', operationName);

    apiCall()
      .then((result) => {
        span.setAttributes({
          'api.success': true,
          'operation.completed': true,
        });
        console.log('✅ API trace completed successfully:', operationName);
        span.end();
        resolve(result);
      })
      .catch((error) => {
        span.recordException(error);
        span.setAttributes({
          'api.success': false,
          'error.message': error.message || 'Unknown error',
          'operation.completed': true,
        });
        console.log('❌ API trace completed with error:', operationName, error.message);
        span.end();
        reject(error);
      });
  });
}
