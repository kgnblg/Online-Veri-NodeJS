var questionRoute = require('./QuestionRoute');
var surveyRoute = require('./SurveyRoute');
var socketRoute = require('./SocketRoute');

module.exports = function (app) {
    app.use('/question', questionRoute);
    app.use('/survey', surveyRoute);
    app.use('/socket', socketRoute);
}