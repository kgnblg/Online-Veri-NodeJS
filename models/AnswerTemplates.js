var mongoose = require('mongoose');
var entity = require('./Entity');
var answer = require('./Answer');

var AnswerTemplateObject = {
    ...entity,
    Title: String,
    AccountId: String,
    Answers: [answer.answerSchema]
};

module.exports.answerTemplateObject = AnswerTemplateObject;

var AnswerTemplates = new mongoose.Schema({
    ...AnswerTemplateObject
}, {collection: 'AnswerTemplates'});

module.exports.answerTemplateModel = mongoose.model('AnswerTemplates', AnswerTemplates);




