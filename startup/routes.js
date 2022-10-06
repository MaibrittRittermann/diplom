const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/login', auth);

    app.use(function(err, req, res, next) {
        console.log(err.message, err);
        res.status(500).send('Something failed');
    });
}