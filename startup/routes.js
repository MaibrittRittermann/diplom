const express = require('express');
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const multer = require('multer');
const bodyParser = require('body-parser');
const users = require('../routes/users');
const auth = require('../routes/auth');
const predict = require('../routes/predict');
const photos = require('../routes/photos');
const train = require('../routes/train');

module.exports = function(app) {
    const corsOptions = {
        exposedHeaders: 'Authorization',
    };
    app.disable('x-powered-by');
    app.use(helmet());
    app.use(compression());
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/login', auth);
    app.use('/api/predict', predict);
    app.use('/api/photos', photos);
    app.use('/api/train', train);

    app.use(function(err, req, res, next) {
        console.log(err.message, err);
        res.status(500).send('Something failed:' + err.message);
    });
}

