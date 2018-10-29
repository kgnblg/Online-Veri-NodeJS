var survey = require('../models/Survey');
var surveyEditModel = require('../models/viewmodel/SurveyEditModel');
var surveyResultModel = require('../models/viewmodel/SurveyResultModel');
var surveyParticipant = require('../models/SurveyParticipant');
var mongoHelper = require('../models/MongoHelper');

function getId(id, callback) {
    survey.surveyNew.findOne({ _id: id, IsDeleted: false }).lean().exec((err, res) => {
        if (err) callback(false, err);
        callback(true, res);
    });
}

function getSurveyParticipants(id, callback) {
    surveyParticipant.SurveyParticipant.find({ SurveyId: id, IsDeleted: false }).lean().exec((err, res) => {
        if (err) callback(false, err);
        callback(true, res);
    });
}

function loadResultData(id, callbackForLoadResultData) {
    if (id != null && id != "") {
        getId(id, (status, survey) => {
            if (!status) {
                //TODO: ilgilen
                //console.log("Hata Alındı: ilgilen");
                return;
            }
            if (survey != null) {
                var questionData = surveyEditModel.setQuestions(survey.Questions);
                //console.log(questionData);
                getSurveyParticipants(id, (status, x) => {
                    if (!status) {
                        //TODO: ilgilen
                        //  console.log("Hata Alındı: ilgilen");
                        return;
                    }

                    var setResultOutput = surveyResultModel.setResults(x);

                    var result =
                        {
                            questionData: questionData,
                            userAnswers: setResultOutput,
                            userAnswerCountStart: setResultOutput.length,
                            error: false
                        };

                    result = convertMatrixToNormalQuestionData(result);
                    result = makeAllActive(result);
                    //console.log(result);
                    callbackForLoadResultData(result);
                });
            }
        });
    }
}

function groupBy(collection, property) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1)
            result[index].push(collection[i]);
        else {
            values.push(val);
            result.push([collection[i]]);
        }
    }
    return result;
}


function createPollsterData(userAnswers) {
    var pollsterData = [];
    if (typeof userAnswers !== "undefined") {
        for (var i = 0; i < userAnswers.length; i++) {
            debugger;
            if (typeof userAnswers[i].Settings !== "undefined") {
                userAnswers[i].Settings.pollsterTotal = 1;
                if (userAnswers[i].Settings.pollsterid == null || userAnswers[i].Settings.pollsterid == ""
                    || userAnswers[i].Settings.pollsterid == "000000000000000000000000") {
                    userAnswers[i].Settings.pollsterid = "000000000000000000000000";
                    userAnswers[i].Settings.pollstername = "Online";
                }
                pollsterData.push(userAnswers[i].Settings);
            }
        }

        var combinedResult = [];
        var allPollsterIds = mongoHelper.distinctArray(pollsterData, "pollsterid"); //[...new Set(pollsterData.filter(x => x.pollsterid))];
        var surveyDays = mongoHelper.distinctArray(pollsterData, "workdate"); //[...new Set(pollsterData.filter(x => x.workdate))];

        var chartResults = [];
        allPollsterIds.map((x) => {
            var pollsterDailyPerform = {
                id: x,
                name: (x == null || x == "" || x == "000000000000000000000000" ||
                    pollsterData.find(y => y.pollsterid == x) == null) ? "Online" : pollsterData.find(y => y.pollsterid == x).pollstername,
                dailyCount: []
            };

            surveyDays.map((day) => {
                pollsterDailyPerform.dailyCount.push({
                    date: day,
                    total: pollsterData.filter(y => y.workdate == day && y.pollsterid == x).length
                });
            });

            chartResults.push(pollsterDailyPerform);
        });

        var chartTimeDataArray = [];
        var chartTimeData = groupBy(pollsterData, "pollsterid");
        chartTimeData.forEach((element) => {
            var sumTime = 0;
            element.forEach((x) => { sumTime += Number(x.time); });
            sumTime = sumTime / element.length;
            chartTimeDataArray.push({
                name: element[0].pollstername,
                time: sumTime
            });
        });

        var chartTotalDataArray = [];
        var chartTotalData = chartTimeData.forEach((element) => {
            chartTotalDataArray.push({
                name: element[0].pollstername,
                total: element.length
            });
        });

        var locations = [];
        pollsterData.forEach((x) => {
            if (x.location != null && x.location != "") {
                if (x.location.indexOf('|') > -1) {
                    locations.push({
                        pollstername: x.pollstername,
                        longitute: x.location.split('|')[0],
                        latitude: x.location.split('|')[1],
                        icon: "/content/assets/img/map-icons/icon-" + allPollsterIds.indexOf(x.pollsterid) + ".png",
                        id: x.pollsterid
                    });
                }
            }
        });
        var distinctLocations = [...new Set(locations)];

        return {
            chartResults: chartResults,
            chartTimeData: chartTimeDataArray,
            chartTotalData: chartTotalDataArray,
            locations: distinctLocations
        };

    } else {
        return {
            chartResults: [],
            chartTimeData: [],
            chartTotalData: [],
            locations: [],
        };
    }
}

function controlRatioAltering(alterDataRatio, userAnswers, questions) {

    //console.log("-*-*-*-*-*-* *-* *-* -*-  * * -* - alterDataRatio : : :",alterDataRatio);
    for (var i = 0; i < alterDataRatio.length; i++) {
        questions = combineQuestionAnswers(userAnswers, questions);
        // console.log("---------------controlRatioAltring findAnswersCounts---------------");
        questions = findAnswerCounts(questions);
        var controlRatioAlteringByRatioOutput = controlRatioAlteringByRatio(alterDataRatio[i], userAnswers, questions);
        userAnswers = controlRatioAlteringByRatioOutput.userAnswers;
        alterDataRatio[i] = controlRatioAlteringByRatioOutput.alter;
    }

    return {
        userAnswers: userAnswers,
        questions: questions,
        alterDataRatio: alterDataRatio
    };
}

function controlRatioAlteringByRatio(alter, userAnswers, questions) {
    var selectedQuestion = getQuestionById(String(alter.questionid), questions); //questions.find(x => x.serversideid == alter.questionId);//
    var selectedQuestionAnswers = selectedQuestion.answers;
    alter.questionAnswerTotal = 0;

    for (var j = 0; j < selectedQuestionAnswers.length; j++) {
        alter.questionAnswerTotal += selectedQuestionAnswers[j].quantity;
    }

    var alterRatioDifference = 0;
    var notAlteredTotal = 0;

    for (var j = 0; j < selectedQuestionAnswers.length; j++) {
        if (!selectedQuestionAnswers[j].isAltered) {
            var answerRatio = selectedQuestionAnswers[j].quantity / parseFloat(alter.questionAnswerTotal); //Convert.toSingle
            if (selectedQuestionAnswers[j].serversideid == alter.answerid) {
                selectedQuestionAnswers[j].ratioToSet = parseFloat(alter.ratio / answerRatio);
                selectedQuestionAnswers[j].ratioToSet = (!isFinite(parseFloat(selectedQuestionAnswers[j].ratioToSet))) ? 0 : selectedQuestionAnswers[j].ratioToSet;
                alter.settedRatio = selectedQuestionAnswers[j].ratioToSet;
                alterRatioDifference = parseFloat((selectedQuestionAnswers[j].count / parseFloat(alter.questionAnswerTotal)) - parseFloat(alter.ratio));
                selectedQuestionAnswers[j].isAltered = true;
            }
            else {
                notAlteredTotal += selectedQuestionAnswers[j].quantity;
            }
        }
    }

    for (var j = 0; j < selectedQuestionAnswers.length; j++) {
        if (!selectedQuestionAnswers[j].isAltered) {
            var answerRatio = selectedQuestionAnswers[j].count / parseFloat(alter.questionAnswerTotal);
            selectedQuestionAnswers[j].ratioToSet = parseFloat((answerRatio + (selectedQuestionAnswers[j].quantity / parseFloat(alter.questionAnswerTotal)) * (alterRatioDifference / (notAlteredTotal / parseFloat(alter.questionAnswerTotal)))) / (selectedQuestionAnswers[j].quantity / parseFloat(alter.questionAnswerTotal)));
            selectedQuestionAnswers[j].ratioToSet = (!isFinite(parseFloat(selectedQuestionAnswers[j].ratioToSet))) ? 0 : selectedQuestionAnswers[j].ratioToSet;
        }

        for (var k = 0; k < userAnswers.length; k++) {
            var userAnswersForQuestion = getUserAnswerByQuestionId(selectedQuestion.serversideid, userAnswers[k].QuestionAnswers);
            if (userAnswersForQuestion != null) {
                for (var m = 0; m < userAnswersForQuestion.length; m++) {
                    if (selectedQuestionAnswers[j].serversideid == userAnswersForQuestion[m]) {
                        userAnswers[k].valuebyratio = selectedQuestionAnswers[j].ratioToSet;
                    }
                }
            }
        }
    }

    return {
        userAnswers: userAnswers,
        alter: alter
    };
}

function controlRangeAltering(alterDataRange, userAnswers, questions) {
    for (var i = 0; i < alterDataRange.length; i++) {
        for (var j = userAnswers.length - 1; j > -1; j--) {
            var userAnswersForQuestion = getUserAnswerByQuestionId(String(alterDataRange[i].questionId), userAnswers[j].QuestionAnswers);
            if (userAnswersForQuestion != null) {
                if (Number(userAnswersForQuestion[0]) > Number(alterDataRange[i].to) || Number(userAnswersForQuestion[0]) < Number(alterDataRange[i].from)) {
                    userAnswers.splice(j, 1);
                }
            }
        }
    }

    return userAnswers;
}

function controlAltering(alterDataChart, userAnswers, questions) {
    var removeIndexes = [];
    for (var i = 0; i < alterDataChart.length; i++) {
        for (var j = userAnswers.length - 1; j > -1; j--) {
            var userAnswersForQuestion = getUserAnswerByQuestionId(String(alterDataChart[i].questionId), userAnswers[j].QuestionAnswers);
            if (userAnswersForQuestion != null) {
                for (var k = 0; k < userAnswersForQuestion.length; k++) {
                    if (String(alterDataChart[i].answerId) == userAnswersForQuestion[k]) {
                        removeIndexes.push(j);
                    }
                }
            }
        }
    }

    removeIndexes.sort();
    removeIndexes = [...new Set(removeIndexes)];

    for (var m = removeIndexes.length - 1; m > -1; m--) {
        userAnswers.splice(removeIndexes[m], 1);
    }

    for (var k = 0; k < alterDataChart.length; k++) {
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].answers != null) {
                for (var j = 0; j < questions[i].answers.length; j++) {
                    if (questions[i].serversideid == String(alterDataChart[k].questionId) && String(alterDataChart[k].answerId) == questions[i].answers[j].serversideid) {
                        questions[i].answers[j].active = false;
                    }
                }
            }
        }
    }

    return {
        userAnswers: userAnswers,
        questions: questions
    };
}

function buildResultData(questions) {
    for (var i = 0; i < questions.length; i++) {
        var questionData = questions[i];
        if (questionData.type == "radio" || questionData.type == "dropdown" || questionData.type == "check") {
            questionData.userAnswers = [];
        }
        questionData.valuebyratio = [];
    }

    return questions;
}


function findAnswerCounts(questions) {
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].answers != null) {
            for (var j = 0; j < questions[i].answers.length; j++) {
                questions[i].answers[j].quantity = findAnswerQuantityByAnswerId(questions[i].answers[j].serversideid, questions[i].userAnswers);
                questions[i].answers[j].count = findAnswerCountByAnswerId(questions[i].answers[j].serversideid, questions[i].userAnswers, questions[i].valuebyratio);
            }
        }
    }

    return questions;
}

function findAnswerCountByAnswerId(answerId, questionUserAnswers, values) {
    var total = 0;
    for (var i = 0; i < questionUserAnswers.length; i++) {
        if (questionUserAnswers[i] == answerId) {
            total += values[i];
        }
    }
    return total;
}

function findAnswerQuantityByAnswerId(answerid, userAnswers) {
    var total = 0;
    for (var i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i] == answerid) {
            total += 1;
        }
    }
    return total;
}

function makeAllActive(results) {
    for (var i = 0; i < results.questionData.length; i++) {
        if (results.questionData[i].answers != null && results.questionData[i].answers != [] && results.questionData[i].answers.length != 0) {
            for (var j = 0; j < results.questionData[i].answers.length; j++) {
                results.questionData[i].answers[j].active = true;
            }
        }
    }

    return results;
}

function combineQuestionAnswers(userAnswers, questions) {
    for (var i = 0; i < questions.length; i++) {
        questions[i].userAnswers = [];
        questions[i].valuebyratio = [];
        questions[i].otherAnswers = [];
        for (var j = 0; j < userAnswers.length; j++) {
            var userAnswersForQuestion = getUserAnswerByQuestionId(questions[i].serversideid, userAnswers[j].QuestionAnswers);

            if (questions[i].addother != null && String(questions[i].addother).toLowerCase() == "true") {
                var userOtherAnswerForQuestion = getUserOtherAnswerByQuestionId(questions[i].serversideid, userAnswers[j].QuestionAnswers);
                if (userOtherAnswerForQuestion != null || userOtherAnswerForQuestion != "") {
                    questions[i].otherAnswers.push(userOtherAnswerForQuestion);
                }
            }
            if (userAnswersForQuestion != null) {
                for (var k = 0; k < userAnswersForQuestion.length; k++) {
                    questions[i].userAnswers.push(userAnswersForQuestion[k]);
                    questions[i].valuebyratio.push(userAnswers[j].valuebyratio);
                }
            }
        }
    }

    return questions;
}

function getUserOtherAnswerByQuestionId(questionId, userAllAnswers) {
    if (typeof userAllAnswers !== "undefined") {
        var userAnswers = userAllAnswers.find(x => x.questionid == questionId);
        if (userAnswers != null)
            return userAnswers.otheranswer;

    }
    return [];

}

function getUserAnswerByQuestionId(questionId, userAllAnswers) {
    // console.log("getUserAnswerByQuestionId------questionId : ",questionId);
    //console.log("getUserAnswerByQuestionId------userAllAnswers : ", userAllAnswers);
    if (typeof userAllAnswers !== "undefined") {
        var userAnswers = userAllAnswers.find(x => x.questionid == questionId);
        if (userAnswers != null)
            return userAnswers.answers;
    }

    return [];
}

function convertMatrixToNormalQuestionData(results) {
    var questionDataCount = results.questionData.length;
    for (var i = 0; i < questionDataCount; i++) {
        var question = results.questionData[i];
        if (question.type == "matrix") {
            var matrixQuestions = question.matrixquestions;
            if (question.matrixtype == "radio" || question.matrixtype == "check") {
                for (var j = 0; j < matrixQuestions.length; j++) {
                    var ans = question.answers;
                    var sub = {}; //surveyEditModel.surveyEditQuestion;
                    sub.topquestion = question.question;
                    sub.question = matrixQuestions[j].question;
                    sub.serversideid = matrixQuestions[j].serversideid;
                    sub.type = question.matrixtype;
                    sub.matrixid = question.serversideid;
                    sub.answers = [];

                    ans.map((x) => {
                        sub.answers.push({
                            active: x.active,
                            count: x.count,
                            imagepath: x.imagepath,
                            label: x.label,
                            point: x.point,
                            quantity: x.quantity,
                            serversideid: x.serversideid
                        });
                    });
                    // sub.answers = ans.map(x => {
                    //     active = x.active,
                    //         count = x.count,
                    //         imagepath = x.imagepath,
                    //         label = x.label,
                    //         point = x.point,
                    //         quantity = x.quantity,
                    //         serversideid = x.serversideid
                    // });
                    sub.isSubMatrix = true;
                    results.questionData.push(sub);
                }
            } else {
                var secondaryQuestions = question.answers;
                for (var j = 0; j < matrixQuestions.length; j++) {
                    for (var k = 0; k < secondaryQuestions.length; k++) {
                        var ans = question.dropdowndata; //question.dropdowndata

                        var sub = {}; //surveyEditModel.surveyEditQuestion;
                        sub.topquestion = question.question;
                        sub.question = matrixQuestions[j].question + " - " + secondaryQuestions[k].label;
                        sub.serversideid = matrixQuestions[j].serversideid + "-" + secondaryQuestions[k].serversideid;
                        sub.type = question.matrixtype;
                        sub.matrixid = question.serversideid;
                        sub.answers = [];
                        ans.map((x) => {
                            sub.answers.push({
                                active: x.active,
                                count: x.count,
                                imagepath: x.imagepath,
                                label: x.label,
                                point: x.point,
                                quantity: x.quantity,
                                serversideid: x.serversideid
                            });
                        });
                        // sub.answers = ans.map(x => {
                        //     active = x.active,
                        //         count = x.count,
                        //         imagepath = x.imagepath,
                        //         label = x.label,
                        //         point = x.point,
                        //         quantity = x.quantity,
                        //         serversideid = x.serversideid
                        // });
                        sub.isSubMatrix = true;
                        results.questionData.push(sub);
                    }
                }
            }
        }
    }

    var userAnswersCount = results.userAnswers.length;
    for (var i = 0; i < userAnswersCount; i++) {
        var userAnswers = results.userAnswers[i].QuestionAnswers;
        var questionAnswersCount = userAnswers.length;

        for (var j = 0; j < questionAnswersCount; j++) {
            var userAnswer = userAnswers[j];
            if (userAnswer.type == "matrix") {
                if (userAnswer.matrixtype == "radio" || userAnswer.matrixtype == "check") {
                    for (var k = 0; k < userAnswer.matrixanswers.length; k++) {
                        var sub = {}; //surveyResultModel.surveyResultAnswersModel;
                        sub.questionid = userAnswer.matrixanswers[k].questionid;
                        sub.answers = userAnswer.matrixanswers[k].answers;
                        sub.isSubMatrix = true;
                        sub.matrixid = userAnswer.questionid;
                        sub.type = userAnswer.matrixtype;
                        results.userAnswers[i].QuestionAnswers.push(sub);
                    }
                } else {
                    for (var k = 0; k < userAnswer.multimatrixanswers.length; k++) {
                        var multimatrix = userAnswer.multimatrixanswers[k];
                        for (var t = 0; t < multimatrix.answers.length; t++) {
                            var newArray = [];
                            newArray.push(String(multimatrix.answers[t].answer));
                            var sub = {}; //surveyResultModel.surveyResultAnswersModel;
                            sub.questionid = multimatrix.questionid + "-" + multimatrix.answers[t].col;
                            sub.answers = newArray;
                            sub.isSubMatrix = true;
                            sub.matrixid = userAnswer.questionid;
                            sub.type = userAnswer.matrixtype;
                            results.userAnswers[i].QuestionAnswers.push(sub);
                        }
                    }
                }
            }
        }
    }

    return results;
}

function getQuestionById(questionId, questions) {
    return questions.find(x => x.serversideid == questionId);
}

function getSessionKey(id) {
    return "result-" + id + "-" + new Date().Now;
}

// ---------------------------- MODULE EXPORTS ----------------------------- //

module.exports.anketSonuclariniGetir = (req, res) => {
    loadResultData(req.body.id, (surveyResult) => {
        if (!surveyResult.error) {
            var questions = surveyResult.questionData;
            var userAnswers = surveyResult.userAnswers;
            var userAnswerCountStart = surveyResult.userAnswerCountStart;

            questions = combineQuestionAnswers(userAnswers, questions);
            questions = findAnswerCounts(questions);
            questions = buildResultData(questions);

            var pollsterData = createPollsterData(userAnswers);

            var jsonResult = JSON.stringify({
                questionData: questions,
                pollsterData: pollsterData,
                userAnswerCountStart: userAnswerCountStart,
                userAnswerCountEdited: surveyResult.userAnswers.length
            });
            //console.log(jsonResult);
            res.end(jsonResult);
        } else {
            res.end(JSON.stringify({
                questionData: [],
                pollsterData: [],
                userAnswerCountStart: 0,
                userAnswerCountEdited: 0
            }));
        }
    });

}

module.exports.anketSonuclariniDuzenle = (req, res) => {
    var allAlters = JSON.parse(req.body.alters);
    loadResultData(req.body.id, (surveyResult) => {
        if (!surveyResult.error) {
            var questions = surveyResult.questionData;
            var userAnswers = surveyResult.userAnswers;
            var userAnswerCountStart = surveyResult.userAnswerCountStart;
            userAnswers = controlRangeAltering(allAlters.alterDataRange, userAnswers, questions);
            var controlAlteringOutput = controlAltering(allAlters.alterDataChart, userAnswers, questions);
            userAnswers = controlAlteringOutput.userAnswers;
            questions = controlAlteringOutput.questions;
            var controlRatioAlteringOutput = controlRatioAltering(allAlters.alterDataRatio, userAnswers, questions);
            userAnswers = controlRatioAlteringOutput.userAnswers;
            questions = controlRatioAlteringOutput.questions;
            allAlters.alterDataRatio = controlRatioAlteringOutput.alterDataRatio;
            questions = combineQuestionAnswers(userAnswers, questions);
            questions = findAnswerCounts(questions);
            questions = buildResultData(questions);

            var jsonResult = JSON.stringify({
                questionData: questions,
                userAnswerCountStart: userAnswerCountStart,
                userAnswerCountEdited: userAnswers.length
            });
            //console.log(jsonResult);
            res.end(jsonResult);
        } else {
            res.end(JSON.stringify({
                questionData: [],
                userAnswerCountStart: 0,
                userAnswerCountEdited: 0
            }));
        }
    });
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

module.exports.anketCaprazlamaGetir = (req, res) => {
    var allAlters = JSON.parse(req.body.alters);
    var questionIds = req.body.questionIds;

    loadResultData(req.body.id, (surveyResult) => {
        var questions = surveyResult.questionData;
        var userAnswers = surveyResult.userAnswers;

        userAnswers = controlRangeAltering(allAlters.alterDataRange, userAnswers, questions);
        var controlAlteringOutput = controlAltering(allAlters.alterDataChart, userAnswers, questions);
        userAnswers = controlAlteringOutput.userAnswers;
        questions = controlAlteringOutput.questions;
        var controlRatioAlteringOutput = controlRatioAltering(allAlters.alterDataRatio, userAnswers, questions);
        userAnswers = controlRatioAlteringOutput.userAnswers;
        questions = controlRatioAlteringOutput.questions;
        questions = combineQuestionAnswers(userAnswers, questions);
        questions = findAnswerCounts(questions);

        var selectedQuestions = JSON.parse(questionIds);

        var firstQuestion = surveyResult.questionData.find(x => x.serversideid == String(selectedQuestions.first));
        var secondQuestion = surveyResult.questionData.find(x => x.serversideid == String(selectedQuestions.second));

        var categories = firstQuestion.answers.filter(x => x.active);
        var secondAnswers = secondQuestion.answers.filter(x => x.active);

        var seriesDataTempList = [];

        secondAnswers.forEach((secondAnswer) => {
            var seriesDataTemp = {};

            seriesDataTemp.name = secondAnswer.label;
            seriesDataTemp.id = secondAnswer.serversideid;
            seriesDataTemp.data = [];


            categories.map((category) => {
                var totalFromAnswers = 0;
                userAnswers.forEach((x) => {
                    var flag1, flag2 = false;
                    if(x.QuestionAnswers.questionid == firstQuestion.serversideid){
                        x.QuestionAnswers.answers.forEach((y) => {
                            if(y.serversideid == category.serversideid){
                                console.log(y.serversideid +" ++++++++++ "+ category.serversideid)
                                flag1 = true;
                                return;

                            }
                        });
                    }

                    if(x.QuestionAnswers.questionid == secondQuestion.serversideid){
                        x.QuestionAnswers.answers.forEach((y) => {
                            if(y.serversideid == secondAnswer.serversideid){
                                flag2 = true;
                                return;
                            }
                        });
                    }

                    if(flag1 && flag2){
                        totalFromAnswers += answers.valuebyratio;
                    }
                    console.log(totalFromAnswers);
                });

       

                // var answers = userAnswers.find(x => x.QuestionAnswers.some(y => y.questionid == firstQuestion.serversideid &&
                //     y.answers.filter(z => z.serversideid == category.serversideid)) &&
                //     x.QuestionAnswers.some(y => y.questionid == secondQuestion.serversideid &&
                //         y.answers.filter(z => z.serversideid == secondAnswer.serversideid)));


                // var totalFromAnswers = 0;

                // totalFromAnswers += answers.valuebyratio;

                seriesDataTemp.data.push({
                    id: category.serversideid,
                    total: totalFromAnswers,
                    y: 0.0
                });
            });

            seriesDataTempList.push(seriesDataTemp);
        });

        var generalTotal = 0.0;
        var totalTemp = {};
        totalTemp.name = "Toplam";
        totalTemp.id = "0";
        totalTemp.data = [];
        categories.map((category) => {
            var total = 0;
            seriesDataTempList.map((temp) => {
                temp.data.map((cat) => {
                    if (cat.id == category.serversideid) {
                        total += cat.total;
                    }
                });
            });

            //console.log(totalTemp.data);

            totalTemp.data.push({
                id: category.serversideid,
                total: total,
                y: 0.0
            });
            generalTotal += total;
        });
        seriesDataTempList.push(totalTemp);

        //console.log(seriesDataTempList);

        var seriesData = [];
        seriesDataTempList.map((i) => {
            var item = {};

            item.name = i.name;
            item.data = [];


            i.data.map((mapD) => {
                var d={};
                d.total=0;
                d=mapD;
                if (i.id == "0") {
                    var y = parseFloat((parseFloat(d.total) / parseFloat(generalTotal)) * 100);
                    y = !isFinite(y) ? 0 : y;

                    item.data.push({ total: d.total, y: y });
                } else {
                    var localTotal = 0.0;
                    totalTemp.data.map((total) => {
                        if (total.id == d.id) {
                            localTotal = total.total;
                            return; //break;
                        }
                    });

                    var y = parseFloat((parseFloat(d.total) / parseFloat(localTotal)) * 100);
                    y = !isFinite(y) ? 0 : y;

                    item.data.push({ total: d.total, y: y });
                }
            });

            seriesData.push(item);
        });

        var jsonResult = {
            categories: categories.map(x => { return x.label; }),
            seriesData: seriesData
        };

        //console.log(jsonResult.seriesData.data);

        res.end(JSON.stringify(jsonResult));
    });
}