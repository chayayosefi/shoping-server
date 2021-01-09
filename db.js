const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://chaya:0528676389@cluster0.mqtlc.mongodb.net/store?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', err => console.log(err));
db.once('open', () => {
    console.log('connected to mongo on localhost')
});