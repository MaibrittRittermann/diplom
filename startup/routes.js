const express = require('express');
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const users = require('../routes/users');
const auth = require('../routes/auth');
const predict = require('../routes/predict');
const ai = require('../routes/ai');

module.exports = function(app) {
    const corsOptions = {
        exposedHeaders: 'Authorization',
    };
    app.disable('x-powered-by');
    app.use(helmet());
    app.use(compression());
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/login', auth);
    app.use('/api/predict', predict);
    app.use('/api/ai', ai);

    app.use(function(err, req, res, next) {
        console.log(err.message, err);
        res.status(500).send('Something failed');
    });
}

