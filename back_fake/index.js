// Mock of REST API

const port = process.env.PORT || 3500;

const express = require('express');
const history = require('connect-history-api-fallback');
const session = require('express-session');
const bodyParser = require('body-parser');

const root = `${__dirname}/dist`;

const http = require('http');

const app = express();

const server = http.createServer(app);

// trust first proxy
app.set('trust proxy', 1);

const newSession = session({
  secret: '9890ILHLKH;lkasf90098',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // false if no https
    secure: false,

    // keep cookie
    maxAge: 900000,
  },
});
app.use(newSession);

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
  bodyParser.json(),
);

app.post('/api/user', (req, res) => {
  console.log(req.body);

  res.send('ok');
});

app.post('/api/auth', (req, res) => {
  let id = '100';
  if (req.body.user === 'admin') {
    id = '1';
  } else if (req.body.user === 'test') {
    id = '2';
  }

  res.send({
    user: req.body.user,
    id,
    type: req.body.user === 'admin' ? 'ADMIN' : 'OTHER',
    accounts: [
      { id: '2', label: 'Martine' },
      { id: '3', label: 'Gilberte' },
      { id: '4', label: 'Maurice' },
      { id: '5', label: 'Other' },
    ],
  });
});

const eventTypes = [{
  id: 'INFO',
  label: 'Info',
}, {
  id: 'DEFAULT',
  label: 'Inscription',
}];

const events = [
  {
    id: '1',
    type: 'DEFAULT',
    users: [
      {
        id: '1',
        user: 'Admin',
        subscriptions: [
          { userId: '1', teamId: '1' },
          { userId: '2', teamId: '1' },
          { userId: '3', teamId: '1' },
          { userId: '4', teamId: '1' },
        ],
      },
      {
        id: '2',
        user: 'Test',
        subscriptions: [
          { userId: '20', teamId: '1' },
          { userId: '5', teamId: '1' },
        ],
      },
    ],
    start: '2018-12-29',
    end: '2019-01-01',
    areaId: '1',
  },
  {
    id: '2',
    type: 'INFO',
    users: [],
    start: '2018-12-31',
    end: '2019-01-04',
    areaId: '2',
  },
  {
    id: '3',
    type: 'DEFAULT',
    users: [
      {
        id: '1',
        user: 'ADMIN',
        accountIds: ['2', '5'],
        teamId: '3',
      },
    ],
    start: '2019-02-10',
    end: '2019-02-17',
    areaId: '3',
  },
];

const areas = [{ id: '1', label: 'Chaudron' }, { id: '2', label: 'Princesse Pauline' }, { id: '3', label: 'Mougins' }];

const teams = [
  { id: '1', label: 'Bravoure', color: 'red' },
  { id: '2', label: 'Sagesse', color: 'blue' },
  { id: '3', label: 'Instinct', color: 'yellow' },
];

app.get('/api/raidex', (req, res) => {
  res.send(events);
});

app.get('/api/raidex/:id', (req, res) => {
  res.send(events.find(event => event.id === req.params.id));
});

app.get('/api/browses/areas', (req, res) => {
  res.send(areas);
});

app.get('/api/browses/raidex-types', (req, res) => {
  res.send(eventTypes);
});

app.get('/api/browses/teams', (req, res) => {
  res.send(teams);
});

app.delete('/api/auth', (req, res) => {
  res.send('ok');
});


if (process.env.NODE_ENV === 'production') {
  // configure static with HTML5 history
  const staticFileMiddleware = express.static(root);
  app.use(staticFileMiddleware);
  app.use(history());
  app.use(staticFileMiddleware);
}

server.listen(port, () => console.log(`Poke RaidEx mock running on port ${port}`));
