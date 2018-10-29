var surveyEditModel = require('../models/viewmodel/SurveyEditModel');
var surveyResultModel = require('../models/viewmodel/SurveyResultModel');
var strings = require('./Strings');
var survey = require('../models/Survey');
var mongoHelper = require('../models/MongoHelper');
var surveyParticipant = require('../models/SurveyParticipant');

function getSurveyById(id, callback) {
    survey.surveyNew.findOne({ _id: id }).exec((err, res) => {
        if (err) callback(false);
        if (res != null) {
            var output = surveyEditModel.modelToViewModel(res);
            //console.log(output);
            callback(JSON.stringify(output));
        } else {
            callback(JSON.stringify({ message: strings.surveyNotFind }));
        }
    });
}

function updateSurvey(id, model, callback) {
    var updateObject = surveyEditModel.viewModelToModel(model);
    //console.log(updateObject.Questions[0]._id + "++++++++++++++++" + updateObject.Questions[0].id);
    survey.surveyNew.updateOne({ _id: id }, { $set: { ...updateObject } }, (err, tank) => {
        //console.log(tank);
        callback((tank.ok != 0) ? true : false);
    });
}

function saveSurvey(accountId, model, callback) {
    var convertedObject = surveyEditModel.viewModelToModel(model);
    var saveObject = new survey.surveyNew();

    saveObject.set(convertedObject);
    saveObject.AccountId = accountId;
    saveObject.save((err) => {
        //console.log(err);
        callback((err == null) ? true : false);
    });
}

function getSurveyRulesById(id, callback) {
    survey.surveyNew.findOne({ _id: id }).exec((err, res) => {
        if (err) callback(false);
        if (res != null) {
            var output = surveyEditModel.setRules(res.Rules);
            // console.log(output);
            callback(JSON.stringify(output));
        } else {
            callback(JSON.stringify({ message: strings.surveyNotFind }));
        }
    });
}

function saveSurveyRules(id, model, callback) {
    if (id != null && id != "" && model != null && model != "") {
        getSurveyById(id, (result) => {
            if (result != false) {
                var newRuleList = surveyEditModel.getRules(model);
                survey.surveyNew.updateOne({ _id: id }, { $set: { "Rules": { ...newRuleList } } }, (err, tank) => {
                    callback((tank.ok != 0) ? true : false);
                });
            } else {
                callback(false);
            }
        });
    } else {
        callback(false);
    }
}

function saveSurveyQuestions(id, model, callback) {
    if (id != null && id != "" && model != null && model != "") {
        getSurveyById(id, (result) => {
            if (result != false) {
                //var updateObject = surveyEditModel.getQuestions(model);
                var updateObject = surveyEditModel.getQuestions(model);
                survey.surveyNew.updateOne({ _id: id }, { $set: { 'Questions': [ ...updateObject] } }, (err, tank) => {
                    console.log(err);
                    callback((tank.ok != 0) ? true : false);
                });
            } else {
                callback(false);
            }
        });
    } else {
        callback(false);
    }
}

function getSurveyParticipants(id, callback) {
    var output = [];
    surveyParticipant.SurveyParticipant.find({ SurveyId: id }).exec((err, res) => {
        if (err) callback(false);
        callback(res);
    });
}

function getAnswerResults(id, callback) {
    survey.surveyNew.findOne({ _id: id }).exec((err, res) => {
        if (err) callback(false);
        if (res != null) {
            //var questionDatas = surveyEditModel.setQuestions(res.Questions);
            getSurveyParticipants(id, (out) => {
                if (out != false) {
                    var surveyParticipants = out;
                    var userAnswer = surveyResultModel.setResults(surveyParticipants);
                    var jsonResult = JSON.stringify({ userAnswer: userAnswers, questionData: questionDatas });
                    callback(jsonResult);
                } else {
                    callback(false);
                }
            });
        } else {
            callback(false);
        }
    });
}

// ---------------------------- MODULE EXPORTS ----------------------------- //

module.exports.anketiGetir = (req, res) => {
    if (req.body.id != null || req.body.id != "") {
        getSurveyById(req.body.id, (x) => {
            if (!x) res.end(strings.error);
            res.end(x);
        });
    }
}

module.exports.anketEkleDuzenle = (req, res) => {
    if (req.body.Settings.Id != null && req.body.Settings.Id != "") {
        if (req.body.Settings.Id == mongoHelper.setId(req.body.Settings.Id)) {
            updateSurvey(req.body.Settings.Id, req.body, (result) => {
                if (result) {
                    res.end(strings.updateSuccess);
                } else {
                    res.end(strings.error);
                }
            });
        } else {
            res.end(strings.error);
        }
    } else {
        saveSurvey(req.accountId, req.body, (result) => {
            if (result) {
                res.end(strings.updateSuccess);
            } else {
                res.end(strings.error);
            }
        });
    }
}

module.exports.anketKurallariniGetir = (req, res) => {
    if (req.body.id != null || req.body.id != "") {
        getSurveyRulesById(req.body.id, (x) => {
            if (!x) res.end(strings.error);
            res.end(x);
        });
    } else {
        res.end(strings.error);
    }
}

module.exports.anketKurallariniKaydet = (req, res) => {
    if (req.body.id != null || req.body.id != "") {
        saveSurveyRules(req.body.id, req.body, (result) => {
            if (result) {
                res.end(strings.updateSuccess);
            } else {
                res.end(strings.error);
            }
        });
    } else {
        res.end(strings.error);
    }
}

module.exports.anketSorulariniKaydet = (req, res) => {
    if (req.body.id != null || req.body.id != "") {
        saveSurveyQuestions(req.body.id, req.body.data, (result) => {
            if (result) {
                res.end(strings.updateSuccess);
            } else {
                res.end(strings.error);
            }
        });
    } else {
        res.end(strings.error);
    }
}

module.exports.anketSonuclariniGetir = (req, res) => {
    if (req.body.id != "" || req.body.id != null) {
        getAnswerResults(req.body.id, (x) => {
            if (!x) res.end(strings.error);
            res.end(x);
        });
    }
}