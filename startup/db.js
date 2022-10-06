const mongoose = require('mongoose');
const config = require('config');

module.exports = mongoose.connect(config.get('connectionString'), {
  //  useFindAndModify: false, 
    useUnifiedTopology: true, 
    useNewUrlParser: true,
  //  useCreateIndex: true
}).then(() => console.log(`Connected to DB: ${config.get('connectionString')}`))
  .catch(err => console.log(`DB error: ${err.message}`));