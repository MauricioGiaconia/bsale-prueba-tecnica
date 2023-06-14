const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('./database/db.js');

const server = express();
const routes = require('./routes/index.js');

server.name = 'Bsale - Airlines';

server.use(cors());

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());

server.use(routes);

// Error catching endware.
server.use((err, req, res, next) => { 
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
