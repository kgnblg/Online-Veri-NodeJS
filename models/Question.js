var mongoose = require('mongoose');
var entity = require('./Entity');
var enums = require('./Enums');
var answer = require('./Answer');

var matrixQuestion = {
    ...entity,
    Question: String
};

module.exports.matrixQuestionModel = mongoose.model('MatrixQuestion', new mongoose.Schema({...matrixQuestion}, {collection: 'MatrixQuestion'}));
module.exports.matrixQuestion = matrixQuestion;

var matrixCustomColumn = {
    ...entity,
    Text: String,
    Type: Number,//, enum: enums.QuestionType
    Answers: [answer.answerSchema],
    AddOther: Boolean,
    IsRequired: Boolean
};

module.exports.matrixCustomColumnModel = mongoose.model('matrixCustomColumn', new mongoose.Schema({...matrixCustomColumn}, {collection: 'MatrixCustomColumn'}));
module.exports.matrixCustomColumn = matrixCustomColumn;

var questionSchema = {
    ...entity,
    MatrixType: Number,//, enum: enums.QuestionType
    PreDescription: String,
    Text: String,
    IsRequired: Boolean,
    Type:  Number, //, enum: enums.QuestionType
    Description: String,
    ImagePath: String,
    AddOther: Boolean,
    ListData: [],
    Answers: [answer.answerSchema],
    DropDownData: [answer.answerSchema],
    MatrixQuestions: [matrixQuestion],
    MatrixCustomColumns: [matrixCustomColumn],
    Position: Number,
    IsActive: Boolean
};

module.exports.question = questionSchema;
module.exports.questionModel = mongoose.model('Question', new mongoose.Schema({...questionSchema, _id:{type:String, auto:false}}, {_id: false, collection: 'Question'}));