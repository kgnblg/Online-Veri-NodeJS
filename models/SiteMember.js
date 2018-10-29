var mongoose = require('mongoose');
var entity = require('./Entity');
var enums = require('./Enums');

var SiteMember = new mongoose.Schema({
    ...entity,
    AccountId: String,
    FirstName: String,
    LastName: String,
    FullName: String,
    UserName: String,
    Password: String,
    Email: String,
    MemberType: Number, //{type: String, enum: enums.SiteMemberType},
    IsActive: Boolean,
    ResultCount: Number
}, {collection: 'SiteMembers'});

module.exports = mongoose.model('SiteMembers', SiteMember);