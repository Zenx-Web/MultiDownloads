import 'dotenv/config';
import { createApiServer } from './api/server';
import { config } from './shared/config';

async function main(): Promise<void> {
  const app = await createApiServer();
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on :${config.port}`);
  });
}

main().catch(() => {
  // Never leak stack traces to users; but we can log minimal startup failure.
  // eslint-disable-next-line no-console
  console.error('API failed to start');
  process.exit(1);
});
