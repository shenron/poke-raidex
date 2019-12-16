// @flow

import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoDBStore from 'connect-mongodb-session';
import devRoute from '@/routes/dev';
import routesUsers from '@/routes/users';
import routesAuthentication from '@/routes/authentication';
import routesAdmin from '@/routes/admin';
import routesBrowses from '@/routes/browses';
import protectRoutes from '@/routes/protect';
import protectAdminRoutes from '@/routes/protectAdmin';
import connectToDb from '@/db/connect';
import config from '@/config';

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
    secure: config.secure,
  },
};

app.set('trust proxy', 1); // trust first proxy

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session(sessionConfig));

if (app.get('env') !== 'production') {
  app.use(devRoute);
}

app.get('/api', (req: express$Request, res: express$Response) => res.send('Welcome !'));
app.use('/api/auth', routesAuthentication);
app.use('/api/users', protectRoutes, routesUsers);
app.use('/api/browses', protectRoutes, routesBrowses);
app.use('/api/admin', protectAdminRoutes, routesAdmin);

app.listen(config.serverPort, () => console.log(`Back run on port ${config.serverPort}!`));
