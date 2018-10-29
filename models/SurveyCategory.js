var mongoose = require('mongoose');
var entity = require('./Entity');

var SurveyCategory = new mongoose.Schema({
    ...entity,
    AccountId: String,
    Name: String,
    Description: String,
    IsActive: Boolean
}, {collection: 'SurveyCategories'});

module.exports = mongoose.model('SurveyCategories', SurveyCategory);