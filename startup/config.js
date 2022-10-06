require('dotenv').config();
const config = require('config');

module.exports = function() {
    if(!config.get('jwtPrivateKey')) {
        console.log('FATAL ERROR - jwt Private Key not defined');
        process.exit(1);
    }
}