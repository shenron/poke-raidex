// @flow

import express from 'express';
import session from 'express-session';
import mongoDBStore from 'connect-mongodb-session';
import devRoute from '@/routes/dev';
import routesUsers from '@/routes/users';
import connectToDb from '@/db/connect';
import config from '@/config/config.dev';

const app = express();

const MongoDBStore = mongoDBStore(session);
const store = new MongoDBStore({
  uri: `mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`,
  collection: 'sessions',
});

connectToDb();

const sessionConfig = {
  name: 'blog-js',
  secret: '2039KYH&*6g',
  store,
  proxy: true,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.UNSECURE === undefined || process.env.UNSECURE === '' || process.env.UNSECURE === String(false),
  },
};

app.set('trust proxy', 1); // trust first proxy

app.use(session(sessionConfig));

if (app.get('env') !== 'production') {
  app.use(devRoute);
}

app.get('/api', (req: express$Request, res: express$Response) => res.send('Welcome !'));
app.use('/api/users', routesUsers);

app.listen(config.serverPort, () => console.log(`Back run on port ${config.serverPort}!`));
