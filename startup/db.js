const mongoose = require('mongoose');
const config = require('config');
const cert = config.get('MDBcert');

module.exports = mongoose.connect(config.get('connectionString'), {
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    sslKey: cert,
    sslCert: cert
}).then(() => console.log(`Connected to DB: ${config.get('connectionString')}`))
  .catch(err => console.log(`DB error: ${err.message} - connect: ${config.get('connectionString')}`));