import { buildApp } from './app.js';
import { ENV } from './config/env.js';

async function start() {
  const app = await buildApp();
  try {
    const address = await app.listen({ port: ENV.PORT, host: '0.0.0.0' });
    console.log(`🚀 Achariya AI ONE Enterprise Platform Backend active on ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
