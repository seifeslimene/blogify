import * as fs from 'fs-extra';
import * as path from 'path';

const dotenv = require('dotenv');

const isProd = process.env.NODE_ENV === 'production';

function parseEnv(): { file: string; config: Record<string, unknown> } {
  const envFiles = [
    isProd ? path.resolve(__dirname, '../../../.env.prod') : '',
    path.resolve(__dirname, '../../../.env.local'),
    path.resolve(__dirname, '../../../.env'),
  ].filter(Boolean);
  const file = envFiles.find((envFile) => fs.existsSync(envFile));

  if (!file) {
    throw new Error(`Can not locate any .env file in ${__dirname}`);
  }

  const config = dotenv.parse(fs.readFileSync(file));

  return { file, config };
}

export const { file, config } = parseEnv();
