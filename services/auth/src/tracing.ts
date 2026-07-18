// src/tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Attributes, Context, Link, SpanKind } from '@opentelemetry/api';
import {
  AlwaysOnSampler,
  Sampler,
  SamplingResult,
  SamplingDecision,
} from '@opentelemetry/sdk-trace-base';

// Create a custom structural sampler wrapper
export class HealthCheckIgnoreSampler implements Sampler {
  private _fallbackSampler = new AlwaysOnSampler();
  shouldSample(
    context: Context,
    traceId: string,
    name: string,
    spanKind: SpanKind,
    attributes: Attributes,
    links: Link[],
  ): SamplingResult {
    // 1. Check the span name (e.g., "GET /health/live" or "GET /metrics")
    const lowerName = name.toLowerCase();
    if (lowerName.includes('/health') || lowerName.includes('/metrics')) {
      return { decision: SamplingDecision.NOT_RECORD };
    }

    // Look at the HTTP target path string
    const httpTarget =
      attributes['http.target'] || attributes['url.path'] || '';

    // If it hits your health check routes, drop it completely
    if (
      typeof httpTarget === 'string' &&
      (httpTarget.startsWith('/health') || httpTarget === '/metrics')
    ) {
      return {
        decision: SamplingDecision.NOT_RECORD, // 👈 Directly tells OTEL to ignore this trace
      };
    }

    // Otherwise, delegate to the standard AlwaysOn sampler logic (0 arguments)
    return new AlwaysOnSampler().shouldSample();
    // Delegate properly with all arguments passed down
    // return this._fallbackSampler.shouldSample(context, traceId, name, spanKind, attributes, links);
  }

  toString(): string {
    return 'HealthCheckIgnoreSampler';
  }
}

// The URL points directly to the Jaeger Kubernetes service we created in Step 2
const traceExporter = new OTLPTraceExporter({
  url:
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
    'jaeger-collector.istio-system.svc.cluster.local:4317',
});

export const otelSDK = new NodeSDK({
  resource: {
    attributes: {
      'service.name': process.env.OTEL_SERVICE_NAME,
    },
    merge: (other: any) => other, // satisfying basic internal method duck-typing if needed
  } as any,
  sampler: new HealthCheckIgnoreSampler(),
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Suppress noisy internal framework logs if necessary
      '@opentelemetry/instrumentation-fs': { enabled: false },

      // the HTTP/Express instrumentation to ignore specific paths
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (req) => {
          const url = req.url || '';
          // Ignore /health, /health/live, /metrics
          return url.startsWith('/health') || url === '/metrics';
        },
      },
    }),
  ],
});

// Gracefully shut down SDK on process termination
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(() => console.log('SDK shut down successfully'))
    .catch((err) => console.log('Error shutting down SDK', err))
    .finally(() => process.exit(0));
});
