var surveyEditModel = require('../models/viewmodel/SurveyEditModel');
var questionTemplate = require('../models/QuestionTemplate');
var answerTemplate = require('../models/AnswerTemplates');
var mongoose = require('mongoose');
var mongoHelper = require('../models/MongoHelper');
var strings = require('./Strings');
var survey = require('../models/Survey');

function save(accountId, model, callback) {
    console.log(model);
    var convertedObject = surveyEditModel.getQuestionTemplate(model);
    var saveObject = new questionTemplate();

    saveObject.set(convertedObject);
    saveObject.AccountId = accountId;
    saveObject.save((err) => {
        //console.log(err);
        callback((err == null) ? true : false);
    });
}

function updateById(id, model, callback) {
    var updateObject = surveyEditModel.getQuestionTemplate(model);
    questionTemplate.updateOne({ _id: id }, { $set: { ...updateObject } }, (err, tank) => {
        callback((tank.ok != 0) ? true : false);
    });
}

function deleteById(id) {
    questionTemplate.updateOne({ _id: id }, { $set: { "IsDeleted": "true" } }, (err, tank) => {
        callback((tank.ok != 0) ? true : false);
    });
}

function getAll(id, callback) {
    questionTemplate.find({ IsActive: true, AccountId: id }).sort({ Title: 1 }).exec((err, res) => {
        if (err) callback(false);
        var output = surveyEditModel.setPreparedQuestions(res);
        callback(JSON.stringify(output));
    });
}

function getById(id, callback) {
    questionTemplate.findOne({ _id: id }).exec((err, res) => {
        if (err) callback(false);
        var output = surveyEditModel.setPreparedQuestion(res);
        callback(JSON.stringify(output));
    });
}

function getAllAnswers(id, callback) {
    answerTemplate.find({ AccountId: id }).sort({ Title: 1 }).exec((err, res) => {
        if (err) callback(false);
        var output = surveyEditModel.setPreparedQuestions(res);
        console.log(output);
        callback(JSON.stringify(output));
    });
}

function getAnswerById(id, callback) {
    answerTemplate.answerTemplateModel.findOne({ _id: id }).exec((err, res) => {
        if (err) callback(false);
        var output = surveyEditModel.setPreparedAnswer(res);
        callback(JSON.stringify(output));
    });
}

function saveAnswer(accountId, model, callback) {
    var convertedObject = surveyEditModel.getAnswerTemplate(model);
    var saveObject = new answerTemplate.answerTemplateModel();

    saveObject.set(convertedObject);
    saveObject.AccountId = accountId;
    saveObject.save((err) => {
        callback((err == null) ? true : false);
    });
}

function updateAnswerById(id, model, callback) {
    var updateObject = surveyEditModel.getAnswerTemplate(model);
    answerTemplate.answerTemplateModel.updateOne({ _id: id }, { $set: { ...updateObject } }, (err, tank) => {
        callback((tank.ok != 0) ? true : false);
    });
}

function deleteAnswerById(id) {
    answerTemplate.answerTemplateModel.updateOne({ _id: id }, { $set: { "IsDeleted": "true" } }, (err, tank) => {
        callback((tank.ok != 0) ? true : false);
    });
}

// ---------------------------- MODULE EXPORTS ----------------------------- //

module.exports.hazirSoruEkle = (req, res) => {
    if (req.body.serversideid) {
        if (mongoHelper.setId(req.body.serversideid) == req.body.serversideid) {
            updateById(req.body.serversideid, req.body, (result) => {
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
        save(req.AccountId, req.body, (result) => {
            if (result) {
                res.end(strings.saveSuccess);
            }else{
                res.end(strings.error);
            }
        });  
    }
}

module.exports.hazirSoruSil = (req, res) => {
    if (mongoHelper.setId(req.body.serversideid) == req.body.serversideid) {
        if (deleteById(req.body.serversideid)) res.send(strings.deleteSuccess);
        res.end(strings.error);
    } else {
        res.end(strings.error);
    }
    res.end();
}

module.exports.hazirSorulariGetir = (req, res) => {
    getAll(req.AccountId, (x) => {
        if (!x) res.end(strings.error);
        res.end(x);
    });
}

module.exports.hazirSoruGetir = (req, res) => {
    try {
        if (req.body.id) {
            getById(req.body.id, (x) => {
                if (!x) res.end(strings.error);
                res.end(x);
            });
        } else {
            res.end(JSON.stringify({ "message": "Byte array must be 12 bytes long.\r\nParametre adı: bytes" }));
        }
    } catch (err) {
        res.end(JSON.stringify(strings.error));
    }
}

module.exports.hazirCevapGetir = (req, res) => {
    try {
        getAnswerById(req.body.id, (x) => {
            if (!x) res.end(strings.error);
            res.end(x);
        });
    } catch (err) {
        res.end(JSON.stringify(strings.error));
    }
}

module.exports.hazirCevaplariGetir = (req, res) => {
    getAllAnswers(req.AccountId, (x) => {
        if (!x) res.end(strings.error);
        res.end(x);
    })
}

module.exports.hazirCevapEkle = (req, res) => {
    if (req.body.serversideid) {
        if (mongoHelper.setId(req.body.serversideid) == req.body.serversideid) {
            updateAnswerById(req.body.serversideid, req.body, (result) => {
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
        saveAnswer(req.AccountId, req.body, (result) => {
            if (result) {
                res.end(strings.saveSuccess);
            }else{
                res.end(strings.error);
            }
        }); 
    }
}

