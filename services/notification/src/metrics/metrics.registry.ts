// metrics/metrics.registry.ts
import { Registry, collectDefaultMetrics } from 'prom-client';

export const register = new Registry();

collectDefaultMetrics({ register });






// import { Counter } from 'prom-client';
// import { register } from './metrics.registry';

// export const messagesProcessed = new Counter({
//   name: 'notification_messages_processed_total',
//   help: 'Total processed messages',
// });

// register.registerMetric(messagesProcessed);

// messagesProcessed.inc();