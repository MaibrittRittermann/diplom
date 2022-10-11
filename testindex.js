'use strict';
/*eslint no-console: ["error", { allow: ["log"] }] */

// Dependencies
const express = require('express');
const Raven = require('raven');
const { port, allowedOrigins, sentryDSN } = require('./config');
Raven.config(sentryDSN).install();
const httpShutdown = require('http-shutdown');
const bodyParser = require('body-parser');
// const controller = require('./startup/routes');
const helmet = require('helmet');
// const routes = require('./routes');

// Initialize the app
const app = express();
// Middleware
app.use(Raven.requestHandler());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigins.join(','));
  res.header('Access-Control-Allow-METHODS', 'GET,POST,PUT,PATCH,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With,Content-Type,Authorization'
  );
  next();
});
app.use(helmet());
require('./startup/routes')(app);

// Load the API routes from the routes file
// routes.load(app, controller);

// Listen on the port
const server = httpShutdown(app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
}));

server.host = `http://localhost:${port}`;

module.exports = server;