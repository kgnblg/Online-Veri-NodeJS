var surveyResultModel = require('../models/viewmodel/SurveyResultModel');
var surveyEditModel = require('../models/viewmodel/SurveyEditModel');
var surveyParticipant = require('../models/SurveyParticipant');
var siteLog = require('../models/SiteLog');
var enums = require('../models/Enums');

function getSurveyById(id, callback) {
    survey.surveyNew.findOne({ _id: id }).exec((err, res) => {
        if (err) callback(false);
        if (res != null) {
            var output = surveyEditModel.modelToViewModel(res);
            //console.log(output);
            callback(output);
        } else {
            callback(false);
        }
    });
}

function getSurveyForOnline(onlineUrl, callback) {
    onlineUrl = onlineUrl.toLowerCase();
    survey.surveyNew.findOne({ OnlineUrl: onlineUrl, IsActive: true, IsSupportOnline: true }).exec((err, res) => {
        if (err) callback(false);
        if (res != null) {
            callback(res);
        } else {
            callback(false);
        }
    });
}

function addOnlineResult(entity, ip, callback) {
    var flag1, flag2 = false;
    if (entitiy != null) {
        var survey = getSurveyById(entity.SurveyId);
        if (survey.IsActive && survey.EndDate >= new Date().Now && survey.BeginDate <= new Date().Now && survey.IsSupportOnline) {
            entity.PollsterName = "Online : " + ip;
            entity.AccountId = survey.AccountGroupId;
            entity.PollsterId = "000000000000000000000000";

            var saveObject = new surveyParticipant.SurveyParticipant();

            saveObject.set(entity);
            saveObject.save((err) => {
                flag1 = (err == null) ? true : false;
            });

            var saveLogObject = new siteLog();
            saveLogObject.AccountId = survey.AccountGroupId;
            saveLogObject.Text = ip + " ip adresinden " + survey.Title + " anketine katılım eklendi.";
            saveLogObject.Roles = enums.SiteMemberType;
            saveLogObject.save((err) => {
                flag2 = (err == null) ? true : false;
            });

            callback((flag1 && flag2) ? true : false);
        } else {
            callback(false);
        }
    } else {
        callback(false);
    }
}

module.exports.setResult = (req, res) => {
    var status = false;
    var model = req.body;
    try {
        if (model != null) {
            var item = surveyResultModel.setModelToViewModel(model);
            if (item.SurveyId != null && item.SurveyId != "") {
                var contineu = true;
                if (survey != null && survey.IsActive && survey.EndDate >= new Date().Now && survey.BeginDate <= new Date().Now && survey.IsSupportOnline) {
                    if (survey.IsIpSecured && req.cookies["_surveys"] != null && req.cookies["_surveys"].indexOf(item.SurveyId) > -1) {
                        contineu = false;
                    }

                    if (contineu) {
                        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                        if (survey.IsPasswordSupport && survey.OnlinePassword != null && survey.OnlinePassword != "" && req.cookies["_" + survey.Id] != null) {
                            ip = req.cookies["_" + survey.Id] + " : " + ip;
                        }
                        addOnlineResult(item, ip, (result) => {
                            req.cookies["_surveys"] = req.cookies["_surveys"] != null ? res.cookie["_surveys"] + "," + item.SurveyId : item.SurveyId;
                            res.cookie(expires, new Date().Now + 604800000);
                            res.end(JSON.stringify({ status: status, message: status ? "Ankete katıldığınız için teşekkürler." : "Katılım kaydedilirken hata alındı." }));
                        });
                    } else {
                        res.end(JSON.stringify({ status: false, message: "Ankete daha önce katıldınız. İlginiz için teşekkürler." }));
                    }
                } else {
                    res.end(JSON.stringify({ status: false, message: "Ankete daha önce katıldınız. İlginiz için teşekkürler." }));
                }
            } else {
                res.end(JSON.stringify({ status: false, message: "Ankete daha önce katıldınız. İlginiz için teşekkürler." }));
            }
        } else {
            res.end(JSON.stringify({ status: false, message: "Ankete daha önce katıldınız. İlginiz için teşekkürler." }));
        }
    } catch (err) { }
}

module.exports.getSurvey = (req, res) => {
    var item = getSurveyForOnline(req.body.id);
    if (req.body.id != "" && req.body.id != null && item != null) {
        if (item.IsIpSecured && req.cookies["_surveys"] != null && req.cookies["_surveys"].indexOf(id) > -1) {
            res.end(JSON.stringify({ status: false, message: "Ankete daha önce katıldınız. İlginiz için teşekkürler." }));
        } else {
            var pollsterLimit = 0;
            var totalResult = 0;

            var model = {};
            model.Settings = surveyEditModel.setMobileSettings(item);
            model.Settings.DailyPollsterLimit = String(pollsterLimit);
            model.Settings.TotalResult = String(totalResult);
            model.Questions = surveyEditModel.setQuestions(item.Questions);
            model.Rules = surveyEditModel.setRules(item.Rules);
            res.end(JSON.stringify({survey: model}));
        }
    }else{
        res.end(JSON.stringify({ status: false, message: "Katılmak istediğiniz anket bulunamadı." }));
    }
}