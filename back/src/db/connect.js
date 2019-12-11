// @flow

import Mongoose from 'mongoose';
import config from '../config/config.dev';
import { initGroups } from './init';

Mongoose.Promise = global.Promise;

const connectToDb = async () => {
  const { dbHost, dbPort, dbName } = config;
  try {
    await Mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.info('Connected to mongo!!!');
    console.info(`mongodb://${dbHost}:${dbPort}/${dbName}`);

    await initGroups();
  } catch (err) {
    console.error('Could not connect to MongoDB');
  }
};

export default connectToDb;
