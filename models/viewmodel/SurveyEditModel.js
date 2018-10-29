var enums = require('../Enums');
var mongoHelper = require('../MongoHelper');
var surveyNew = require('../Survey');
var answerTemplate = require('../AnswerTemplates');
var questionTemplate = require('../QuestionTemplate');
var question = require('../Question');
var answer = require('../Answer');

var SurveyEditRule = {
    serversideid: String,
    rulequestion: String,
    ruleanswer: String,
    ruletarget: String,
    rulelogic: String
};

var SurveyEditSettings = {
    Id: String,
    SurveyName: String,
    Title: String,
    CategoryId: String,
    Description: String,
    ImagePath: String,
    BeginDate: String,
    EndDate: String,
    VoteLimit: String,
    TotalResult: String,
    DailyPollsterLimit: String,
    AccountId: String,
    Pollsters: [String],
    Editors: [String],
    BeginText: String,
    EndText: String,
    IsActive: String,
    SurveyProcessedResult: String,
    IsSupportOnline: String,
    IsIpSecured: String,
    IsPasswordSupport: String,
    OnlinePassword: String,
    OnlineUrl: String,
    BackgroundVoiceRecord: String
};

var SurveyEditAnswer = {
    serversideid: String,
    label: String,
    imagepath: String,
    point: String,
    active: Boolean,
    quantity: Number,
    count: Number,
    isAltered: Boolean,
    ratioToSet: Number
    //valuebyratio;
};

var SurveyEditAnswerTemplate = {
    serversideid: String,
    name: String,
    answers: [SurveyEditAnswer]
};

var SurveyEditMatrixQuestion = {
    serversideid: String,
    question: String
};

var SurveyEditMatrixCustomColumn = {
    serversideid: String,
    question: String,
    type: String,
    addother: String,
    required: String,
    answers: [SurveyEditAnswer]
};

var SurveyEditQuestion = {
    serversideid: String,
    type: String,
    matrixtype: String,
    question: String,
    addother: String,
    predescription: String,
    description: String,
    required: String,
    imagepath: String,
    listdata: [String],
    matrixquestions: [SurveyEditMatrixQuestion],
    answers: [SurveyEditAnswer],
    dropdowndata: [SurveyEditAnswer],
    matrixcustomcolumns: [SurveyEditMatrixCustomColumn],
    topquestion: String,
    matrixid: String,
    isSubMatrix: Boolean,
    userAnswers: [Object],
    valuebyratio: Number,
    otherAnswers: [Object]
};

module.exports.surveyEditQuestion = SurveyEditQuestion;

var SurveyEditQuestionTemplate = {
    ...SurveyEditQuestion,
    name: String
};

module.exports.surveyEditQuestionTemplate = SurveyEditQuestionTemplate;

var SurveyEditModel = {
    Settings: SurveyEditSettings,
    Questions: [SurveyEditQuestion],
    Rules: [SurveyEditRule]
};

module.exports.modelToViewModel = (survey) => {
    try {
        var model = SurveyEditModel;

        if (survey != null) {
            model.Settings = setSettings(survey);
            model.Questions = setQuestions(survey.Questions);
            model.Rules = setRules(survey.Rules);
        }
        return model;
    } catch (error) {
        console.log(error);
        throw " File: SurveyEditModel - Row: 125.";
    }
}

module.exports.viewModelToModel = (model) => {
    var m = surveyNew.surveyNew;
    try {
        if (model != null) {
            m.AccountId = model.Settings.AccountId;

            try { m.BeginDate = mongoHelper.dateSplitter(model.Settings.BeginDate); }
            catch (Exception) { m.BeginDate = mongoHelper.dateSplitter(new Date().Now); console.log(Exception); }

            try { m.EndDate = mongoHelper.dateSplitter(model.Settings.EndDate); }
            catch (Exception) { m.EndDate = mongoHelper.dateSplitter(new Date().setMonth(new Date().getMonth() + 1)); console.log(Exception); }

            m.CategoryId = model.Settings.CategoryId;
            m.Description = model.Settings.Description;
            m.BeginText = model.Settings.BeginText;
            m.EndText = model.Settings.EndText;
            m.ImagePath = model.Settings.ImagePath;
            m.SurveyProcessedResult = String(model.Settings.SurveyProcessedResult);
            m.SurveyName = model.Settings.SurveyName;
            m.Title = model.Settings.Title;

            m.IsActive = model.Settings.IsActive;
            m.VoteLimit = Number(model.Settings.VoteLimit);
            m.DailyPollsterLimit = Number(model.Settings.DailyPollsterLimit);

            // try { m.IsActive = Boolean(model.Settings.IsActive); }
            // catch (Exception) { m.IsActive = true; console.log(Exception); }

            // try { m.VoteLimit = Number(model.Settings.VoteLimit); }
            // catch (Exception) { m.VoteLimit = 0; console.log(Exception); }

            // try { m.DailyPollsterLimit = Number(model.Settings.DailyPollsterLimit); }
            // catch (Exception) { m.DailyPollsterLimit = 0; console.log(Exception); }

            m.Pollsters = model.Settings.Pollsters;
            m.Editors = model.Settings.Editors;
            m.Questions = getQuestions(model.Questions);
            //console.log(m.Questions);
            m.Rules = getRules(model.Rules);

            m.IsSupportOnline = model.Settings.IsSupportOnline;
            m.IsIpSecured = model.Settings.IsIpSecured;
            m.BackgroundVoiceRecord = model.Settings.BackgroundVoiceRecord;
            m.IsPasswordSupport = model.Settings.IsPasswordSupport;

            // try { m.IsSupportOnline = Boolean(model.Settings.IsSupportOnline); }
            // catch (Exception) { m.IsSupportOnline = false; console.log(Exception); }

            // try { m.IsIpSecured = Boolean(model.Settings.IsIpSecured); }
            // catch (Exception) { m.IsIpSecured = false; console.log(Exception); }

            // try { m.BackgroundVoiceRecord = Boolean(model.Settings.BackgroundVoiceRecord); }
            // catch (Exception) { m.BackgroundVoiceRecord = false; console.log(Exception); }

            // try { m.IsPasswordSupport = Boolean(model.Settings.IsPasswordSupport); }
            // catch (Exception) { m.IsPasswordSupport = false; console.log(Exception); }
            m.OnlinePassword = model.Settings.OnlinePassword != null ? model.Settings.OnlinePassword.toLowerCase().trim() : "";
            m.OnlineUrl = model.Settings.OnlineUrl;
            return m;
        }
    } catch (error) {
        console.log(error);
        throw " File: SurveyEditModel - Row: 182.";
    }
}

function setSettings(model) {
    var m = SurveyEditSettings;
    //try {

    m.AccountId = "";
    m.BeginDate = mongoHelper.shortDateString(model.BeginDate);
    m.EndDate = mongoHelper.shortDateString(model.EndDate);
    m.DailyPollsterLimit = "0";
    m.TotalResult = "0";
    m.CategoryId = "";
    m.Description = model.Description;
    m.BeginText = model.BeginText;
    m.EndText = model.EndText;
    m.ImagePath = model.ImagePath;
    m.IsActive = "true";
    m.SurveyProcessedResult = null; //model.SurveyProcessedResult;
    m.SurveyName = "";
    m.Title = model.Title;
    m.VoteLimit = "0";
    m.IsSupportOnline = String(model.IsSupportOnline);
    m.IsPasswordSupport = String(model.IsPasswordSupport);
    m.BackgroundVoiceRecord = String(model.BackgroundVoiceRecord).toLowerCase();

    m.OnlinePassword = model.OnlinePassword != null ? model.OnlinePassword.toLowerCase().trim() : "";
    m.OnlineUrl = model.OnlineUrl;

    //Extended
    m.Id = "";
    m.Pollsters = model.Pollsters;
    m.Editors = model.Editors;
    m.IsIpSecured = "";
    //TODO: gözden geçir
    return m;
    // } catch (error) {
    //     console.log(error);
    //     throw " File: SurveyEditModel - Row: 191.";
    // }
}

function setMobileSettings(model) {
    var m = {}; //new SurveyEditSettings();
    //try {
    if (m != null) {
        m.Id = model._id;
        m.AccountId = "";
        m.BeginDate = String(new Date("dd.MM.yyyy").Now); //DateTime.Now.Date.ToString("dd.MM.yyyy");
        m.EndDate = "";
        m.DailyPollsterLimit = String(model.DailyPollsterLimit);
        m.CategoryId = "";
        m.Description = model.Description;
        m.BeginText = model.BeginText;
        m.EndText = model.EndText;
        m.ImagePath = model.ImagePath;
        m.IsActive = "true";
        m.SurveyName = "";
        m.Title = model.Title;
        m.VoteLimit = "0";
        m.BackgroundVoiceRecord = String(model.BackgroundVoiceRecord).toLowerCase();
        return m;
    }
    // } catch (error) {
    //     console.log(error);
    //     throw " File: SurveyEditModel - Row: 217.";
    // }
}

module.exports.setMobileSettings = setMobileSettings;

function setQuestion(q) {
    //TODO: Geri düzeltmeyi unutma.
    var m = {}; //SurveyEditQuestion;
    m.matrixtype = "";
    m.matrixquestions = [];
    m.matrixcustomcolumns = [];
    m.matrixid = "";

    if (q.Type == enums.QuestionType.Matrix) {
        m.matrixtype = enums.convertQuestionTypeToString(q.MatrixType);

        if (q.MatrixQuestions != null && Object.keys(q.MatrixQuestions).length > 0) {
            m.matrixquestions = [];

            q.MatrixQuestions.map((subQ) => {
                var surveyEditMatrixQuestionObject = {}; //SurveyEditMatrixQuestion;
                surveyEditMatrixQuestionObject.serversideid = subQ._id;
                surveyEditMatrixQuestionObject.question = subQ.Question;
                m.matrixquestions.push(surveyEditMatrixQuestionObject);
            });
        }
    } else if (q.Type == enums.QuestionType.MatrixCustom) {
        if (q.MatrixQuestions != null && Object.keys(q.MatrixQuestions).length > 0) {
            m.matrixquestions = [];
            q.MatrixQuestions.map((subQ) => {
                var surveyEditMatrixQuestionObject = {}; //SurveyEditMatrixQuestion;
                surveyEditMatrixQuestionObject.serversideid = subQ._id;
                surveyEditMatrixQuestionObject.question = subQ.Question;
                m.matrixquestions.push(surveyEditMatrixQuestionObject);
            });
        }

        m.matrixcustomcolumns = setMatrixCustomColumns(q.MatrixCustomColumns);
    }

    m.addother = String(q.AddOther).toLowerCase();
    m.description = q.Description;
    m.type = enums.convertQuestionTypeToString(q.Type);
    m.question = q.Text;
    m.imagepath = q.ImagePath;
    m.isSubMatrix = false;

    m.predescription = q.PreDescription;
    m.required = String(q.IsRequired).toLowerCase();
    m.serversideid = q._id;
    m.answers = setAnswers(q.Answers);
    // console.log(m.answers);
    m.dropdowndata = setAnswers(q.DropDownData);
    m.listdata = (q.ListData != null && q.ListData.length > 0) ? q.ListData : [];
    return m;
}

function setQuestions(questionList) {
    var newList = [];
    if (questionList != null && questionList.length > 0) {
        questionList.map((element) => {
            newList.push(setQuestion(element));
        });
    }
    if (newList[0] == {})
        return [];

    return newList;
}
module.exports.setQuestions = setQuestions;

function setPreparedQuestion(q) {
    var m = {}; //SurveyEditQuestionTemplate
    // console.log(q);
    m.name = q.Title;
    m.matrixtype = "";
    m.matrixquestions = null;

    if (q.Type == enums.QuestionType.Matrix) {
        m.matrixtype = enums.convertQuestionTypeToString(q.MatrixType);
        if (q.MatrixQuestions != null && q.MatrixQuestions.length > 0) {
            m.matrixquestions = [];
            q.MatrixQuestions.map((subQ) => {
                m.matrixquestions.push({
                    question: subQ.Question,
                    serversideid: subQ._id
                });
            });
        }
    } else if (q.Type == enums.QuestionType.MatrixCustom) {
        if (q.MatrixQuestions != null && q.MatrixQuestions.length > 0) {
            m.matrixquestions = [];
            q.MatrixQuestions.map((subQ) => {
                m.matrixquestions.push({
                    question: subQ.Question,
                    serversideid: subQ._id
                });
            });
        }

        m.matrixcustomcolumns = setMatrixCustomColumns(q.MatrixCustomColumns);
    }

    m.addother = String(q.AddOther).toLowerCase();
    m.description = q.Description;
    m.type = enums.convertQuestionTypeToString(q.Type);
    m.question = q.Text;
    m.imagepath = q.ImagePath;

    m.predescription = q.PreDescription;
    m.required = String(q.IsRequired).toLowerCase();
    m.serversideid = q._id;
    m.answers = setAnswers(q.Answers);
    m.dropdowndata = setAnswers(q.DropDownData);
    m.listdata = (q.ListData != null && q.ListData.length > 0) ? q.ListData : [];

    if (q.AddOther && (q.Type == enums.QuestionType.Checkbox || q.Type == enums.QuestionType.RadioButton)) {
        if (m.answers == null)
            m.answers = [];

        var surveyEditAnswerObject = {};
        surveyEditAnswerObject.imagepath = "";
        surveyEditAnswerObject.label = "Diğer";
        surveyEditAnswerObject.point = 0;
        surveyEditAnswerObject.serversideid = "";//000000000000000000000000);

        m.answers.push(surveyEditAnswerObject);
    }

    m.answers = mongoHelper.uniqueAnswerArrayForViewModel(m.answers);
    return m;
}

module.exports.setPreparedQuestion = setPreparedQuestion;
module.exports.setPreparedQuestions = (questionList) => {
    newList = [];
    if (questionList != null && questionList.length > 0) {
        questionList.forEach((element) => {
            newList.push(setPreparedQuestion(element));
        });
    }
    return newList;
}

function setAnswers(answerList) {
    var answers = [];
    if (answerList != null && answerList.length > 0) {

        answerList.map((a) => {
            var answer = {};
            answer.serversideid = String(mongoHelper.setId(a._id)); //TODO:
            answer.imagepath = a.ImagePath ? a.ImagePath : "";
            answer.label = a.Label === "" ? "Cevap" : a.Label;
            answer.point = String((a.Tag) ? a.Tag : 0);
            answers.push(answer);
        });

    }

    if (answers.length == 1  && answers[0] == {}) {
        return [];
    } else {
        return answers;
    }

}

function setPreparedAnswer(q) {
    var m = SurveyEditAnswerTemplate;
    if (q) {
        m.serversideid = q._id;
        m.name = q.Title;
        m.answers = setAnswers(q.Answers);
    } else {
        m.serversideid = mongoHelper.setId();
        m.name = "";
        m.answers = [SurveyEditAnswer];
    }

    return m;
}

module.exports.setPreparedAnswer = setPreparedAnswer;

module.exports.setPreparedAnswers = (answerList) => {
    newList = [];
    if (answerList != null && answerList.length > 0) {
        answerList.forEach((element) => {
            newList.push = setPreparedAnswer(element);
        });

    }
    return newList;
}

function setRules(ruleList) {
    var items = [];

    if (ruleList != null && ruleList.length > 0) {
        ruleList.forEach((a) => {
            var answer = SurveyEditRule;
            answer.serversideid = a._id;
            answer.rulequestion = a.QuestionId;
            answer.ruleanswer = a.AnswerId;
            answer.ruletarget = a.TargetQuestionId;
            answer.rulelogic = enums.convertRuleLogicToString(a.RuleLogic);

            items.push(answer);
        });
    }
    return items;
}
module.exports.setRules = setRules;

function setMatrixCustomColumn(q) {
    var m = {};
    m.addother = String(q.AddOther).toLowerCase();
    m.required = String(q.IsRequired).toLowerCase();
    m.type = enums.convertQuestionTypeToString(q.Type);
    m.question = q.Text;
    m.answers = setAnswers(q.Answers);
    m.serversideid = q._id;
    return m;
}

function setMatrixCustomColumns(matrixList) {
    var newMatrixList = [];

    if (matrixList != null && matrixList.length > 0) {
        matrixList.forEach((a) => {
            newMatrixList.push(setMatrixCustomColumn(a));
        });
    }

    if (newMatrixList[0] == {} && newMatrixList.length == 1) {
        return [];
    } else {
        return newMatrixList;
    }
}

function getQuestion(p) {
    var model = new question.questionModel;
    model.Description = p.description;
    model.ImagePath = p.imagepath;
    model.IsActive = true;
    model.PreDescription = p.predescription;
    model.Text = p.question;
    model.Type = enums.convertToQuestionType(p.type);
    model.AddOther = Boolean(p.addother);
    model.IsRequired = Boolean(p.required);
    model._id = p.serversideid;

    model.ListData = (p.listdata != null && p.listdata.length > 0) ? p.listdata : [];

    if (model.Type == enums.QuestionType.Matrix) {
        model.MatrixType = enums.convertToQuestionType(p.matrixtype);
        model.MatrixQuestions = [];
        if (p.matrixquestions != null && p.matrixquestions.length > 0) {
            p.matrixquestions.forEach((subQ) => {
                var matrixQuestionObject = {}; //new question.matrixQuestionModel();
                matrixQuestionObject.Id = subQ.serversideid;
                matrixQuestionObject.Question = subQ.question;
                model.MatrixQuestions.push(matrixQuestionObject);
            });
        }
    } else if (model.Type == enums.QuestionType.MatrixCustom) {
        model.MatrixQuestions = [];
        if (p.matrixquestions != null && p.matrixquestions.length > 0) {
            p.matrixquestions.forEach((subQ) => {
                var matrixQuestionObject = {}; //new question.matrixQuestionModel();
                matrixQuestionObject.Id = subQ.serversideid;
                matrixQuestionObject.Question = subQ.question;
                model.MatrixQuestions.push(matrixQuestionObject);
            });
        }

        model.MatrixCustomColumns = getMatrixCustomColumns(p.matrixcustomcolumns);
    }

    model.Answers = getAnswers(p.answers);
    model.DropDownData = getAnswers(p.dropdowndata);

    return model;
}

function getQuestions(list) {
    var outputList = [];
    if (list != null && list.length > 0) {
        list.forEach((a) => {
            outputList.push(getQuestion(a));
        });

    }
    return outputList;
}
module.exports.getQuestions = getQuestions;

module.exports.getQuestionTemplate = (p) => {
    var model = questionTemplate;
    model.Title = p.name;
    model.Description = p.description;
    model.ImagePath = p.imagepath;
    model.IsActive = true;
    model.PreDescription = p.predescription;
    model.Text = p.question;
    model.Type = enums.convertToQuestionType(p.type);
    model.AddOther = Boolean(p.addother);
    model.IsRequired = Boolean(p.required);
    model._id = mongoHelper.setId(p.serversideid);
    model.ListData = (p.listdata != null && p.listdata.length > 0) ? p.listdata : [];


    if (model.Type == enums.QuestionType.Matrix) {
        model.MatrixType = enums.convertToQuestionType(p.matrixtype);
        model.MatrixQuestions = [];
        p.matrixquestions.forEach((subQ) => {
            var matrixQuestionObject = new question.matrixQuestionModel();
            matrixQuestionObject.Id = mongoHelper.setId(subQ.serversideid);
            matrixQuestionObject.Question = subQ.question;
            model.MatrixQuestions.push(matrixQuestionObject);
        });
    } else if (model.Type == enums.QuestionType.MatrixCustom) {
        model.MatrixQuestions = [];
        p.matrixquestions.map((subQ) => {
            var matrixQuestionObject = new question.matrixQuestionModel();
            matrixQuestionObject.Id = mongoHelper.setId(subQ.serversideid);
            matrixQuestionObject.Question = subQ.question;
            model.MatrixQuestions.push(matrixQuestionObject);
        });

        model.MatrixCustomColumns = getMatrixCustomColumns(p.matrixcustomcolumns);
    }

    model.Answers = getAnswers(p.answers);
    console.log(model.Answers);
    model.DropDownData = getAnswers(p.dropdowndata);
    return model;
}

module.exports.getAnswerTemplate = (p) => {
    var model = answerTemplate.answerTemplateModel;
    model._id = mongoHelper.setId(p.serversideid);
    model.Title = p.name;
    model.Answers = getAnswers(p.answers);
    return model;
}

function getAnswer(p) {
    var model = new answer.answerModel;
    model.ImagePath = p.imagepath ? p.imagepath : "";
    model.Tag = p.point ? p.point : "0";
    model.Label = p.label;
    model._id = String(mongoHelper.setId(p.serversideid)); //mongoHelper.setId(p.serversideid);
    //console.log(model._id + "--------------" + p.serversideid);
    return model;
}

function getAnswers(list) {
    var outputList = [];
    if (list != null && list.length > 0) {
        list.map((a) => {
            outputList.push(getAnswer(a));
        });
    }
    return mongoHelper.uniqueArrayForAnswerList(outputList);
}

function getMatrixCustomColumn(p) {
    var model = new question.matrixCustomColumnModel();
    model.Text = p.question;
    model.Type = enums.convertToQuestionType(p.type);
    model.AddOther = Boolean(p.addother);
    model.IsRequired = Boolean(p.required);
    model.Id = mongoHelper.setId(p.serversideid);
    model.Answers = getAnswers(p.answers);
    return model;
}

function getMatrixCustomColumns(list) {
    var outputList = [];
    if (list != null && list.length > 0) {
        list.forEach((a) => {
            outputList.push(getMatrixCustomColumn(a));
        });
    } return outputList;
}

function getRule(p) {
    var model = {};
    model.QuestionId = p.rulequestion;
    model.AnswerId = p.ruleanswer;
    model.TargetQuestionId = p.ruletarget;
    model.RuleLogic = enums.convertToSurveyRuleLogic(p.rulelogic);
    model.Id = mongoHelper.setId(p.serversideid);
    return model;
}

function getRules(list) {
    var outputList = [];
    if (list != null && list.length > 0) {
        list.forEach((a) => {
            outputList.push(getRule(a));
        });

    }
    return outputList;
}

module.exports.getRules = getRules;