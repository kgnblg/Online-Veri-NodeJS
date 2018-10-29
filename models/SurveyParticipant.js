var mongoose = require('mongoose');
var entity = require('./Entity');
var enums = require('./Enums');

var ParticipantAnswerSchema = {
    Tag: String,
    Answer: String
};

module.exports.ParticipantAnswerSchema = ParticipantAnswerSchema;
module.exports.ParticipantAnswerModel = mongoose.model('ParticipantAnswer', new mongoose.Schema({
    ...ParticipantAnswerSchema
}, {collection: 'ParticipantAnswer'}));

var ParticipantMultiAnswerSchema = {
    Column: String,
    Answer: String
};

module.exports.ParticipantMultiAnswerSchema = ParticipantMultiAnswerSchema;
module.exports.ParticipantMultiAnswerModel = mongoose.model('ParticipantMultiAnswer', new mongoose.Schema({
    ...ParticipantMultiAnswerSchema
}, {collection: 'ParticipantMultiAnswer'}));

var ParticipantMatrixAnswerSchema = {
    QuestionId: String,
    Answers: [ParticipantAnswerSchema]
};

module.exports.ParticipantMatrixAnswerSchema = ParticipantMatrixAnswerSchema;
module.exports.ParticipantMatrixAnswerModel = mongoose.model('ParticipantMatrixAnswer', new mongoose.Schema({
    ...ParticipantMatrixAnswerSchema
}, {collection: 'ParticipantMatrixAnswer'}));

var ParticipantMultiMatrixAnswerSchema = {
    QuestionId: String,
    Answers: [ParticipantMultiAnswerSchema]
};

module.exports.ParticipantMultiMatrixAnswerSchema = ParticipantMultiMatrixAnswerSchema;
module.exports.ParticipantMultiMatrixAnswerModel = mongoose.model('ParticipantMultiMatrixAnswer', new mongoose.Schema({
    ...ParticipantMultiMatrixAnswerSchema
}, {collection: 'ParticipantMultiMatrixAnswer'}));

var ParticipantQuestionSchema = {
    QuestionId: String,
    Type: Number, //{type: String, enum: enums.QuestionType},
    MatrixType: Number, //{type: String, enum: enums.QuestionType},
    AddOther: Boolean,
    Answers: [ParticipantAnswerSchema],
    MatrixAnswers: [ParticipantMatrixAnswerSchema],
    MultiMatrixAnswers: [ParticipantMultiMatrixAnswerSchema],
    OtherAnswer: String
};

module.exports.ParticipantQuestionSchema = ParticipantQuestionSchema;
module.exports.ParticipantQuestionModel = mongoose.model('ParticipantQuestion', new mongoose.Schema({...ParticipantQuestionSchema},{collection: 'ParticipantQuestion'}));

var SurveyParticipant = new mongoose.Schema({
    ...entity,
    AccountId: String,
    PollsterId: String,
    SurveyId: String,
    WorkDate: Date,
    PollsterName: String,
    Time: Number,
    Location: String,
    BackgroundVoice: String,
    BackgroundVoicePath: String,
    Questions: [ParticipantQuestionSchema]
}, {collection: 'SurveyParticipants'});

module.exports.SurveyParticipant = mongoose.model('SurveyParticipants',SurveyParticipant);