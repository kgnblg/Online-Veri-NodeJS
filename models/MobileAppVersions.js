var mongoose = require('mongoose');
var entity = require('./Entity');

var MobileAppVersions = new mongoose.Schema({
    ...entity,
    Version: String,
    Path: String,
    IsUpdatedVersion: Boolean,
}, {collection: 'MobileAppVersions'});

module.exports = mongoose.model('MobileAppVersions', MobileAppVersions);