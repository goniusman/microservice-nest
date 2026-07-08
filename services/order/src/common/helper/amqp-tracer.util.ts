import { propagation, context, trace } from '@opentelemetry/api';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

export class AmqpTracer {
  /**
   * Wraps the standard publish method to automatically inject trace headers
   */
  static publishWithTrace(
    amqpConnection: AmqpConnection,
    exchange: string,
    routingKey: string,
    message: any,
    options: any = {},
    tags: Record<string, string | number | boolean> = {}
  ) {
    // Ensure options and headers exist
    options.headers = options.headers || {};

    // Inject the active trace context into the headers
    propagation.inject(context.active(), options.headers);

    // If there is an active span running right now, attach the tags to it
    const activeSpan = trace.getActiveSpan();
    if (activeSpan) {
      activeSpan.setAttributes({
        'messaging.destination': exchange,
        'messaging.rabbitmq.routing_key': routingKey,
        ...tags // Spread your custom tags here
      });
    }

    // Forward the call to the original rabbitmq client
    return amqpConnection.publish(exchange, routingKey, message, options);
  }
}