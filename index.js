const express = require('express');
const httpShutdown = require('http-shutdown');
const app = express();

require('./startup/config')();
require('./startup/db');
require('./startup/routes')(app);


const port = process.env.PORT || 3005;
const server = httpShutdown(app.listen(port, () => console.log(`Listening on port ${port}`)));

module.exports = server;