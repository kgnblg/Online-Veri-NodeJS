var enums = require('../Enums');
var mongoHelper = require('../MongoHelper');
var surveyNew = require('../Survey');
var siteLog = require('../SiteLog');
var consoleDebugger = require('../../ConsoleDebugger');

var TopPollster = {
    PollsterName: String,
    ResultColunt: Number
};

var DashboardModel = {
    AccountCount,
    PollsterCount,
    SurveyCount,
    LatestSurveys: [surveyNew],
    SiteLogs: [SiteLog],
    PollstersTopList: [TopPollster]
};

function getModel(model, accountId, memberType) {
    consoleDebugger("File: DashboardModel.js Func: getModel. *** UNCOMPLETED");
    if (memberType == enums.SiteMemberType.AccountOwner || memberType == enums.SiteMemberType.AccountTopOwner) {
        // memberType = enums.SiteMemberType.AccountOwner;
        // model.AccountCount = new SiteAccountManager().Count(x => x.AccountGroupId == accountId);
        // model.SurveyCount = new SurveyNewManager().Count(x => x.AccountGroupId == accountId);
        // model.PollsterCount = new SiteMemberManager().Count(x => x.AccountId == accountId && x.MemberType == Enums.SiteMemberType.Pollster);
        // model.LatestSurveys = new SurveyNewManager().GetLatestSurveys(accountId);
        // model.PollstersTopList = new SiteMemberManager().GetTopPollsters(accountId);
        // model.SiteLogs = new SiteLogManager().GetAll(x => x.AccountId == accountId && x.Roles.Contains(memberType)).OrderByDescending(x => x.CreateDate).Take(15).ToList();
    }
    else if (memberType == enums.SiteMemberType.Customer) {
        // var topGroup = new SiteAccountManager().Get(x => x.Id == accountId);
        // if (topGroup != null)
        // {
        //     model.AccountCount = null;
        //     model.SurveyCount = new SurveyNewManager().Count(x => x.AccountId == accountId);
        //     model.PollsterCount = null;
        //     model.LatestSurveys = new SurveyNewManager().GetCustomerSurveys(accountId);
        //     model.PollstersTopList = null;
        //     model.SiteLogs =
        //         new SiteLogManager().GetAll(x => x.AccountId == topGroup.Id && x.Roles.Contains(memberType))
        //             .OrderByDescending(x => x.CreateDate)
        //             .Take(15)
        //             .ToList();
        // }
    }


    return model;
}

function getModelWithEditorId(model, editorId) {
    consoleDebugger("File: DashboardModel.js Func: getModelWithEditorId. *** UNCOMPLETED");
    // if (editorId != null || editorId != "") {
    //     model.AccountCount = 0;
    //     model.SurveyCount = 0;
    //     model.PollsterCount = 0;
    //     //model.LatestSurveys = new SurveyNewManager().GetEditorSurveys(editorId);
    //     model.PollstersTopList = null;
    //     model.SiteLogs = null;
    // }
    // return model;
}