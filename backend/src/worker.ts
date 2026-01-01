import 'dotenv/config';
import { runWorkerLoop } from './queue/workerLoop';

runWorkerLoop().catch(() => {
  // eslint-disable-next-line no-console
  console.error('Worker failed');
  process.exit(1);
});
