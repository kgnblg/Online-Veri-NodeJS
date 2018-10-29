var mongoose = require('mongoose');
var question = require('./Question').question;

var QuestionTemplate = new mongoose.Schema({
    ...question,
    Title: String,
    AccountId: String
}, {collection: 'QuestionTemplates'});

module.exports = mongoose.model('QuestionTemplates', QuestionTemplate);