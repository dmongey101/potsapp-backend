const mongoose = require('mongoose');

mongoose.connect('mongodb://donal:Fog85nil@ds113799.mlab.com:13799/mongeypotsgame', {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to db');
});