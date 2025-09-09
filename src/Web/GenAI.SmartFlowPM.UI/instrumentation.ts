import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

// Add a top-level log to see if the file is being loaded
console.log('🔍 instrumentation.ts file loaded');

export function register() {
  console.log('=== OpenTelemetry Instrumentation Starting ===');
  console.log('Environment variables:');
  console.log('- OTEL_EXPORTER_OTLP_ENDPOINT:', process.env.OTEL_EXPORTER_OTLP_ENDPOINT);
  console.log('- OTEL_SERVICE_NAME:', process.env.OTEL_SERVICE_NAME);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  
  // Check if we have the required environment variables set by Aspire
  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  
  if (!otlpEndpoint) {
    console.log('❌ OTEL_EXPORTER_OTLP_ENDPOINT not set, OpenTelemetry will not be initialized');
    return;
  }
  
  console.log('✅ Initializing OpenTelemetry with endpoint:', otlpEndpoint);
  
  try {
    const sdk = new NodeSDK({
      serviceName: process.env.OTEL_SERVICE_NAME || 'frontend',
      traceExporter: new OTLPTraceExporter({
        url: `${otlpEndpoint}/v1/traces`,
      }),
    instrumentations: [
      getNodeAutoInstrumentations({
        // Disable some instrumentations that might be noisy
        '@opentelemetry/instrumentation-fs': {
          enabled: false,
        },
      }),
    ],
    });

    sdk.start();
    
    console.log('✅ OpenTelemetry SDK started successfully for frontend application');
    console.log('=== OpenTelemetry Instrumentation Complete ===');
  } catch (error) {
    console.error('❌ Failed to initialize OpenTelemetry:', error);
  }
}