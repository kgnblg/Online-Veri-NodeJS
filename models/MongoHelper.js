var db = require('./db');

module.exports.setId = (id) => {
    if(db.Types.ObjectId.isValid(id)){
        return id;
    }else{
        return db.Types.ObjectId();
    }
};

module.exports.shortDateString = (data) => {
    var date = new Date(data);
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}

module.exports.dateSplitter = (date) => {
    var split = date.split(".");
    return split[2]+"-"+split[1]+"-"+split[0]+" 00:00:00.000";
}

module.exports.uniqueArrayForAnswerList = (list) => {
    return list.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj["Label"]).indexOf(obj["Label"]) === pos;
    });
}

module.exports.uniqueAnswerArrayForViewModel = (list) => {
    return list.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj["label"]).indexOf(obj["label"]) === pos;
    });
}

module.exports.distinctArray = (list, prop) => {
    return [...new Set(list.map(mapObj => mapObj[prop]).filter(x => x))];
}