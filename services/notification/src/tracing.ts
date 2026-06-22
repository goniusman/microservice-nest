// src/tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

// The URL points directly to the Jaeger Kubernetes service we created in Step 2
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
    'http://jaeger-collector.istio-system.svc.cluster.local:4317',
});

export const otelSDK = new NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Suppress noisy internal framework logs if necessary
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
  ],
});

// Gracefully shut down SDK on process termination
process.on('SIGTERM', () => {
  otelSDK.shutdown()
    .then(() => console.log('SDK shut down successfully'))
    .catch((err) => console.log('Error shutting down SDK', err))
    .finally(() => process.exit(0));
});