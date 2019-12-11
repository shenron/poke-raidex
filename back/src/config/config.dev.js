// @flow

import path from 'path';

const config: {
  logFileDir: string,
  logFileName: string,
  dbHost: string,
  dbPort: string,
  dbName: string,
  serverPort: number,
} = {
  logFileDir: path.join(__dirname, '../../log'),
  logFileName: 'app.log',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || '27017',
  dbName: process.env.DB_NAME || 'dev',
  serverPort: Number(process.env.BACK_PORT) || 3000,
};

export default config;
