var surveyParticipant = require('../SurveyParticipant');
var mongoHelper = require('../MongoHelper');
var enums = require('../Enums');

var SurveyResultMultiAnswerModel = {
    col: String,
    answer: String
};

var SurveyResultMultiMatrixAnswerModel = {
    questionid: String,
    answers: [SurveyResultMultiAnswerModel]
};

var SurveyResultMatrixAnswerModel = {
    questionid: String,
    answers: [String]
};

var SurveyResultAnswersModel = {
    questionid: String,
    type: String,
    matrixtype: String,
    answers: [String],
    matrixanswers: [SurveyResultMatrixAnswerModel],
    multimatrixanswers: [SurveyResultMultiMatrixAnswerModel],
    addother: String,
    otheranswer: String,
    answerpoint: String
};

module.exports.surveyResultAnswersModel = SurveyResultAnswersModel;

var SurveyResultSettingsModel = {
    accountid: String,
    pollsterid: String,
    surveyid: String,
    workdate: String,
    location: String,
    pollstername: String,
    time: String,
    pollsterTotal: String,
    backgroundvoice: String,
    backgroundvoicepath: String
};

var SurveyResultModel = {
    serversideid: String,
    Settings: SurveyResultSettingsModel,
    QuestionAnswers: [SurveyResultAnswersModel],
    valuebyratio: Number
};

function setModelToViewModel(model) {
    if (model != null) {
        var result = new surveyParticipant.SurveyParticipant();
        result.AccountId = model.Settings.accountid;
        result.PollsterId = model.Settings.pollsterid;
        result.SurveyId = model.Settings.surveyid;
        result.PollsterName = model.Settings.pollstername;
        result.Time = Number(model.Settings.time);
        result.Location = model.Settings.location;
        result.BackgroundVoice = model.Settings.backgroundvoice;
        result.BackgroundVoicePath = model.Settings.backgroundvoicepath;
        try { result.WorkDate = new Date(model.Settings.workdate); }
        catch (Exception) { result.WorkDate = new Date().Now; }

        result.Questions = setAnswers(model.QuestionAnswers);
    }

    return result;
}

module.exports.setModelToViewModel = setModelToViewModel;

function setViewModelToModel(model) {
    var result = {};
    if (model != null) {
        result.Settings = {}; //SurveyResultSettingsModel;
        result.Settings.accountid = model.AccountId;
        result.Settings.pollsterid = model.PollsterId;
        result.Settings.surveyid = model.SurveyId;
        result.Settings.pollstername = model.PollsterName;
        result.Settings.workdate = mongoHelper.shortDateString(model.WorkDate);
        result.Settings.time = String(model.Time);
        result.Settings.location = model.Location;
        result.Settings.backgroundvoice = model.BackgroundVoice != null ? model.BackgroundVoice.toLowerCase() : "false";
        result.Settings.backgroundvoicepath = model.BackgroundVoicePath;
        result.QuestionAnswers = [];
        result.QuestionAnswers = setAnswersForParticipantQuestion(model.Questions);
        // console.log("---------------------------QA------------------------");
        // console.log(result.QuestionAnswers);
        // console.log("---------------------------QA------------------------");
        result.valuebyratio = 1;
    }

    return result;
}

function setResults(models) {
    var outputList = [];
    if (models != null && models.length > 0) {
        models.map((a) => {
            outputList.push(setViewModelToModel(a));
        });
    }
    return outputList;
}
module.exports.setResults = setResults;

function setAnswersForSurveyResultAnswerModel(list) {
    var result = []; //new surveyParticipant.ParticipantQuestionModel();
    if (list != null && list.length > 0) {
        list.forEach((item) => {
            if (item.answers == null && item.matrixanswers == null && item.multimatrixanswers == null &&
                item.otheranswer == null && item.otheranswer == "")
                continue;

            var m = new surveyParticipant.ParticipantQuestionModel();
            m.QuestionId = item.questionid;
            m.Type = enums.convertToQuestionType(item.type);
            m.MatrixType = enums.convertToQuestionType(item.matrixtype);

            m.Answers = []; //surveyParticipant.ParticipantAnswerSchema
            m.MatrixAnswers = []; //surveyParticipant.ParticipantMatrixAnswerSchema
            m.MultiMatrixAnswers = []; //surveyParticipant.ParticipantMultiMatrixAnswerSchema

            m.AddOther = Boolean(item.addother);
            m.OtherAnswer = "";

            if (item.otheranswer)
                m.OtherAnswer = item.otheranswer;

            if (m.Type == enums.QuestionType.Matrix) {
                if ((m.MatrixType == enums.QuestionType.RadioButton || m.MatrixType == enums.QuestionType.Checkbox) && item.matrixanswers != null && item.matrixanswers.length > 0) {
                    //matrix answers
                    item.matrixanswers.forEach((t) => {
                        if (t.answers != null && t.answers.length > 0) {
                            var answer = new surveyParticipant.ParticipantMatrixAnswerModel();
                            answer.QuestionId = t.questionid;
                            answer.Answers = []; //surveyParticipant.ParticipantAnswerSchema
                            t.answers.forEach((a) => {
                                var ptAnswer = new surveyParticipant.ParticipantAnswerModel();
                                ptAnswer.Answer = a;
                                answer.Answers.push(ptAnswer);
                            });
                            m.MatrixAnswers.push(answer);
                        }
                    });
                } else if ((m.MatrixType == enums.QuestionType.DropDown || m.MatrixType == enums.QuestionType.Numeric || m.MatrixType == enums.QuestionType.TextBox) && item.multimatrixanswers != null && item.multimatrixanswers.length > 0) {
                    //multi matrix answers
                    item.multimatrixanswers.forEach((t) => {
                        if (t.answers != null && t.answers.length > 0) {
                            var answer = new surveyParticipant.ParticipantMultiMatrixAnswerModel();
                            answer.QuestionId = t.questionid;
                            answer.Answers = []; //surveyParticipant.ParticipantMultiAnswerSchema
                            t.answers.forEach((a) => {
                                var ptAnswer = new surveyParticipant.ParticipantMultiAnswerModel();
                                ptAnswer.Column = a.col;
                                ptAnswer.Answer = a.answer;
                                answer.Answers.push(ptAnswer);
                            });
                            m.MultiMatrixAnswers.push(answer);
                        }
                    });
                }
            } else if (m.Type == enums.QuestionType.MatrixCustom) {
                item.multimatrixanswers.forEach((t) => {
                    if (t.answers != null && t.answers.length > 0) {
                        var answer = new surveyParticipant.ParticipantMultiMatrixAnswerModel();
                        answer.QuestionId = t.questionid;
                        answer.Answers = []; //surveyParticipant.ParticipantMultiAnswerSchema
                        t.answers.forEach((a) => {
                            var ptAnswer = new surveyParticipant.ParticipantMultiAnswerModel();
                            ptAnswer.Column = a.col;
                            ptAnswer.Answer = a.answer;
                            answer.Answers.push(ptAnswer);
                        });
                        m.MultiMatrixAnswers.push(answer);
                    }
                });
            } else if (item.answers != null && item.answers.length > 0) {
                item.answers.forEach((a) => {
                    if (a) {
                        var ptAnswer = new surveyParticipant.ParticipantAnswerModel();
                        ptAnswer.Answer = a;
                        m.Answers.Add(ptAnswer);
                    }
                });
            }

            if (m.MatrixAnswers.length > 0 || m.Answers.length > 0 || m.MultiMatrixAnswers.length > 0)
                result.push(m);
        });

        return result;
    }
}

function setAnswersForParticipantQuestion(list) {
    var result = []; //SurveyResultAnswersModel;
    if (list != null && list.length > 0) {
        list.forEach((item) => {
            if (item.MatrixAnswers == null && item.MultiMatrixAnswers == null && item.Answers == null &&
                item.OtherAnswer == null && item.OtherAnswer == "") {
            } else {
                var m = {};//SurveyResultAnswersModel
                m.questionid = item.QuestionId;
                m.type = enums.convertQuestionTypeToString(item.Type);
                m.matrixtype = enums.convertQuestionTypeToString(item.MatrixType);
                m.answerpoint = "0";
                m.answers = [];
                m.matrixanswers = [];
                m.multimatrixanswers = [];

                m.addother = String(item.AddOther).toLowerCase();
                m.otheranswer = "";
                if (item.OtherAnswer)
                    m.otheranswer = item.OtherAnswer;

                if (item.Type == enums.QuestionType.Matrix) {
                    if (item.MatrixAnswers != null && item.MatrixAnswers.length > 0 && (item.MatrixType == enums.QuestionType.Checkbox || item.MatrixType == enums.QuestionType.RadioButton)) {
                        item.MatrixAnswers.forEach((x) => {
                            var answerElement = {};
                            answerElement.questionid = x.questionid;
                            answerElement.answers = [];
                            x.Answers.forEach((ans) => {
                                answerElement.answers.push(ans.Answer);
                            });
                            //answerElement.answers buna da bak 
                            //answerelement kontrol et
                            if (answerElement.answers.length != 0 && Object.keys(answerElement).length != 0) {
                                m.matrixanswers.push(answerElement);
                            }
                        });


                        // m.matrixanswers =
                        //     item.MatrixAnswers.Select(
                        //         x =>
                        //             new SurveyResultMatrixAnswerModel
                        //                    {
                        //             questionid = x.QuestionId,
                        //             answers = x.Answers.Select(y => y.Answer).ToList()
                        //         }).ToList();
                    } else if (item.MultiMatrixAnswers != null && item.MultiMatrixAnswers.length > 0 && (item.MatrixType == enums.QuestionType.DropDown || item.MatrixType == enums.QuestionType.TextBox || item.MatrixType == enums.QuestionType.Numeric)) {
                        item.MultiMatrixAnswers.forEach((x) => {
                            var answerElement = {};
                            answerElement.questionid = x.QuestionId;
                            answerElement.answers = [];
                            x.Answers.forEach((y) => {
                                var answerMultiModel = {};//SurveyResultMultiAnswerModel;
                                answerMultiModel.answer = y.Answer;
                                answerMultiModel.col = y.Column;
                                answerElement.answers.push(answerMultiModel);
                            });
                            if (Object.keys(answerElement.answers[0]).length != 0 && Object.keys(answerElement).length != 0) {
                                m.multimatrixanswers.push(answerElement);
                            }
                        });
                        //TODO: Temizlenecek.
                        // m.multimatrixanswers =
                        //     item.MultiMatrixAnswers.Select(
                        //         x =>
                        //             new SurveyResultMultiMatrixAnswerModel
                        //                   {
                        //             questionid = x.QuestionId,
                        //             answers =
                        //             x.Answers.Select(
                        //                 y =>
                        //                     new SurveyResultMultiAnswerModel()
                        //                                   {
                        //                     answer = y.Answer,
                        //                     col = y.Column
                        //                 }).ToList()
                        //         }).ToList();
                    }
                    //else if (item.MultiMatrixAnswers != null && item.MultiMatrixAnswers.Any() && item.MatrixType == Enums.QuestionType.DropDown  )
                    //{
                    //    m.multimatrixanswers =
                    //      item.MultiMatrixAnswers.Select(
                    //          x =>
                    //              new SurveyResultMultiMatrixAnswerModel
                    //              {
                    //                  questionid = x.QuestionId,
                    //                  answers =
                    //                      x.Answers.Select(
                    //                          y =>
                    //                              new SurveyResultMultiAnswerModel()
                    //                              {
                    //                                  answer = y.Answer,
                    //                                  col = y.Column
                    //                              }).ToList()
                    //              }).ToList();
                    //}

                } else if (item.Type == enums.QuestionType.MatrixCustom) {
                    item.MultiMatrixAnswers.forEach((x) => {
                        var answerElement = {};//SurveyResultMultiMatrixAnswerModel;
                        answerElement.questionid = x.QuestionId;
                        answerElement.answers = [];
                        //console.log(x);
                        x.Answers.forEach((y) => {
                            var answerMultiModel = {};// SurveyResultMultiAnswerModel;
                            answerMultiModel.answer = y.Answer;
                            answerMultiModel.col = y.Column;
                            // console.log("y:::::::::::::::::::",y);
                            answerElement.answers.push(answerMultiModel);
                        });
                        if (Object.keys(answerElement.answers[0]).length != 0 && Object.keys(answerElement).length != 0) {
                            m.multimatrixanswers.push(answerElement);
                        }
                    });
                    //TODO: Temizlenecek.
                    // m.multimatrixanswers =
                    //     item.MultiMatrixAnswers.Select(
                    //         x =>
                    //             new SurveyResultMultiMatrixAnswerModel
                    //                      {
                    //             questionid = x.QuestionId,
                    //             answers =
                    //             x.Answers.Select(
                    //                 y =>
                    //                     new SurveyResultMultiAnswerModel()
                    //                                      {
                    //                     answer = y.Answer,
                    //                     col = y.Column
                    //                 }).ToList()
                    //         }).ToList();

                }
                else {
                    if (item.Answers != null) {
                        item.Answers.forEach((x) => {
                            m.answers.push(x.Answer);
                        })
                    }
                }

                if (m.answers != null && m.matrixanswers != null && typeof m.matrixanswers != "undefined" &&
                    typeof m.answers != "undefined" && m.answers != [] && m.matrixanswers != [])
                    result.push(m);
            }

        });

        return result;
    }

    return [];
}