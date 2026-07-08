import { propagation, context, trace, SpanKind } from '@opentelemetry/api';

export function TraceRabbit(queueName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const msg = args[0];
      const rawMessage = args[1]; // The amqplib ConsumeMessage object

      // 1. Extract headers from the message properties
      const amqpHeaders = rawMessage?.properties?.headers || {};
      const parentContext = propagation.extract(context.active(), amqpHeaders);
      const tracer = trace.getTracer('rabbitmq-consumer-pool');

      // 2. Wrap the execution in the extracted context
      return context.with(parentContext, async () => {
        return tracer.startActiveSpan(
          `rabbitmq.consume ${queueName}`,
          { kind: SpanKind.CONSUMER },
          async (span) => {

            // 1. Add standard infrastructure tags automatically
            span.setAttributes({
              'messaging.system': 'rabbitmq',
              'messaging.destination_kind': 'queue',
              'messaging.operation': 'process',
              'messaging.queue.name': queueName,
            });

            // 2. Add dynamic business tags based on the payload safely
            if (msg && typeof msg === 'object') {
              if (msg.id || msg.orderId) {
                span.setAttribute('order.id', String(msg.id || msg.orderId));
              }
              if (msg.userId) {
                span.setAttribute('user.id', String(msg.userId));
              }
            }

            try {
              // 3. Execute the actual controller method
              const result = await originalMethod.apply(this, args);
              span.setStatus({ code: 1 }); // Ok
              return result;
            } catch (error: any) {
              span.recordException(error);
              span.setStatus({ code: 2, message: error.message }); // Error
              throw error;
            } finally {
              span.end();
            }
          }
        );
      });
    };

    return descriptor;
  };
}