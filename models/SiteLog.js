var mongoose = require('mongoose');
var entity = require('./Entity');
var enums = require('./Enums');

var SiteLog = new mongoose.Schema({
    ...entity,
    AccountId: String,
    Text: String,
    LogType: Number, //{type: String, enum: enums.SiteLogType},
    Roles: [Number], //[{type: String, enum: enums.SiteMemberType}]
}, {collection: 'SiteLogs'});

module.exports = mongoose.model('SiteLogs', SiteLog);