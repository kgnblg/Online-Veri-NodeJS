var mongoose = require('mongoose');
var entity = require('./Entity');

var SiteAccount = new mongoose.Schema({
    ...entity,
    AccountGroupId: String,
    CreatorAccountId: String,
    UniqueCode: String,
    AccountName: String,
    ContactPhone: String,
    ContactEmail: String,
    IsActive: Boolean
}, {collection: 'SiteAccounts'});

module.exports = mongoose.model('SiteAccounts', SiteAccount);