// @flow

import mongoose from 'mongoose';
import config from '@/config';
import init from './init';

mongoose.set('useCreateIndex', true);

const connectToDb = async () => {
  const { dbHost, dbPort, dbName } = config;
  try {
    await mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.info('Connected to mongo!!!');
    console.info(`mongodb://${dbHost}:${dbPort}/${dbName}`);

    await init();
  } catch (err) {
    console.error('Could not connect to MongoDB');
    console.log(err);
  }
};

export default connectToDb;
