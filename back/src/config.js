// @flow

import path from 'path';

const config: {
  logFileDir: string,
  logFileName: string,
  dbHost: string,
  dbPort: string,
  dbName: string,
  serverPort: number,
  secure: boolean,
} = {
  logFileDir: path.join(__dirname, '../../log'),
  logFileName: 'app.log',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || '27017',
  dbName: process.env.DB_NAME || process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
  serverPort: Number(process.env.BACK_PORT) || 3500,
  secure: process.env.SECURE === String(true) || process.env.NODE_ENV === 'production',
};

export default config;
