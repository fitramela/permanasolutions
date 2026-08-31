import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(
    __dirname,
    '../../.env'
  ),
});

import app from './app.js';

import {
  ensureInitialCmsData,
} from './bootstrap/ensureInitialCmsData.js';

const PORT =
  Number(process.env.PORT) || 4000;

const HOST =
  process.env.HOST || '0.0.0.0';

async function startServer() {
  try {
    await ensureInitialCmsData();

    app.listen(
      PORT,
      HOST,
      () => {
        console.log(
          `Server running on http://${HOST}:${PORT}`
        );

        console.log(
          `Environment: ${
            process.env.NODE_ENV ||
            'development'
          }`
        );
      }
    );
  } catch (error) {
    console.error(
      'Backend startup failed:',
      error
    );

    process.exit(1);
  }
}

startServer();