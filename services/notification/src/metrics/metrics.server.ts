
import * as express from 'express';
import { register } from './metrics.registry';

export async function startMetricsServer(port: number) {
  const app = express();

  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  app.get('/health', (_req, res) => {
    res.status(200).send('ok');
  });

  app.listen(port, () => {
    console.log(`📊 Metrics server running on :${port}`);
  });
}