// Mock of REST API

const port = process.env.PORT || 3500;

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');

const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const upload = multer();

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
);

app.get('/api/auth', (req, res) => {
  res.send('ok');
});

server.listen(port, () => console.log(`Poke RaidEx mock running on port ${port}`));
