var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var survey = require('./Survey');

var mongoDB = "mongodb://localhost:27017/OnlineVeriLocal";

mongoose.connect(mongoDB, function (err) {
    if (err) {
        console.log("Hata" + err);
    }else{
        console.log("Bağlandı. " + mongoDB);
    }
});

//mongoose.set('debug', true);

// mongoose.connection.on('connected', () => { console.log('-------connected-----------Bağlantı açıldı.') });
// mongoose.connection.on('close', () => { console.log('-------close-----------Bağlantı close.') });
// mongoose.connection.on('disconnected', () => { console.log('----------disconnected------------Bağlantı kapandı.') });
// mongoose.connection.on('SIGTERM', () => { console.log('------------SIGTERM------------Bağlantı kapandı.') });

module.exports = mongoose;