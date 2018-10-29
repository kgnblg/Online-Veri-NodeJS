var entity = require('./Entity');
var mongoose = require('mongoose');

var answerSchema = {
    //_id: {auto: false},
    ...entity,
    Label: String,
    ImagePath: String,
    Tag: Number
};

module.exports.answerModel = mongoose.model('Answer', new mongoose.Schema({...answerSchema, _id:{type:String, auto:false}}, {_id: false, collection: 'Answer'}));
module.exports.answerSchema = answerSchema;