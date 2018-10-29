var mongoose = require('mongoose');
var entity = require('./Entity');
var enums = require('./Enums');
var answer = require('./Answer');
var question = require('./Question').question;

var ruleSchema = {
    ...entity,
    QuestionId: String,
    AnswerId: String,
    TargetQuestionId: String,
    RuleLogic: Number //{type: String, enum: enums.RuleLogic}
};

module.exports.ruleSchema = ruleSchema;
module.exports.ruleModel = mongoose.model('Rule', new mongoose.Schema({...ruleSchema}, {collection: 'Rule'}));

var SurveyNew = new mongoose.Schema({
    ...entity,
    AccountGroupId: String,
    AccountId: String,
    SurveyName: String,
    Title: String,
    Description: String,
    CategoryId: String,
    ImagePath: String,
    BeginDate: Date,
    EndDate: Date,
    IsActiveQuestionOrderDisplay: Boolean,
    IsActiveAllQuestionRequired: Boolean,
    IsActiveVoteLimit: Boolean,
    IsActiveBeginText: Boolean,
    IsActiveEndText: Boolean,
    VoteLimit: Number,
    DailyPollsterLimit: Number,
    BeginText: String,
    EndText: String,
    Questions: [question],
    Rules: [ruleSchema],
    Pollsters: [String],
    IsActive: Boolean,
    SurverProcessedResult: String,
    IsSupportOnline: Boolean,
    IsIpSecured: Boolean,
    IsPasswordSupport: Boolean,
    OnlinePassword: String,
    OnlineUrl: String,
    Editors: [String],
    BackgroundVoiceRecord: Boolean,
    IsArchived: Boolean
}, {collection: 'SurveysNew'});

module.exports.surveyNew = mongoose.model('SurveysNew', SurveyNew);