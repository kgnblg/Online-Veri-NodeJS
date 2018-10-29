var SiteMemberType = {
    SystemAdmin: 0,
    SiteAdmin: 1,
    AccountOwner: 2,
    Customer: 3,
    Pollster: 4,
    SurveyEditor: 5,
    AccountTopOwner: 6
};

module.exports.SiteMemberType = SiteMemberType;

var IdType = {
    Account: 0,
    Survey: 1,
    Question: 2,
    Answer: 3,
    Pollster: 4,
    PanelMenu: 5,
    SurveyResult: 6,
    MatrixColumn: 7,
    MatrixAnswer: 8,
    SurveyCategory: 9,
    AccountUser: 10,
    MatrixRow: 11,
    MatrixDropDownData: 12
};

module.exports.IdType = IdType;

var SiteLogType = {
    PollsterLogin: 0,
    PollsterLogout: 1,
    MemberLogin: 2,
    PollsterSenkron: 3,
    AddSurvey: 4,
    AddPreparedQuestion: 5,
    AddPreparedAnswer: 6
};

module.exports.SiteLogType = SiteLogType;

var RuleLogic = {
    HideQuestion: 0,
    JumpQuestion: 1,
    EndSurvey: 2
};

module.exports.RuleLogic = RuleLogic;

var QuestionType = {
    RadioButton: 0,
    DropDown: 1,
    Checkbox: 2,
    DropDownMultiple: 3,
    MultiText: 4,
    TextBox: 5,
    TextArea: 6,
    Photo: 7,
    Voice: 8,
    Matrix: 9,
    TextBoxEmail: 10,
    TextBoxTckn: 11,
    TextBoxPostCode: 12,
    TextBoxPhone: 13,
    Numeric: 14,
    MatrixSub: 15,
    LongList: 16,
    MatrixCustom: 17
};

module.exports.QuestionType = QuestionType;

module.exports.convertToQuestionType = (type) => {
    switch (type) {
        case "radio":
            return QuestionType.RadioButton;
        case "dropdown":
            return QuestionType.DropDown;
        case "check":
            return QuestionType.Checkbox;
        case "input":
            return QuestionType.TextBox;
        case "textarea":
            return QuestionType.TextArea;
        case "email":
            return QuestionType.TextBoxEmail;
        case "tckn":
            return QuestionType.TextBoxTckn;
        case "phone":
            return QuestionType.TextBoxPhone;
        case "numeric":
            return QuestionType.Numeric;
        case "matrix":
            return QuestionType.Matrix;
        case "photo":
            return QuestionType.Photo;
        case "voice":
            return QuestionType.Voice;
        case "matrixalt":
            return QuestionType.MatrixSub;
        case "multitext":
            return QuestionType.MultiText;
        case "longlist":
            return QuestionType.LongList;
        case "matrixcustom":
            return QuestionType.MatrixCustom;
        default:
            return QuestionType.Checkbox;
    }
}

module.exports.convertQuestionTypeToString = (type) => {
    switch (type) {
        case QuestionType.RadioButton:
            return "radio";
        case QuestionType.DropDown:
            return "dropdown";
        case QuestionType.Checkbox:
            return "check";
        case QuestionType.TextBox:
            return "input";
        case QuestionType.TextArea:
            return "textarea";
        case QuestionType.TextBoxEmail:
            return "email";
        case QuestionType.TextBoxTckn:
            return "tckn";
        case QuestionType.TextBoxPhone:
            return "phone";
        case QuestionType.Numeric:
            return "numeric";
        case QuestionType.Matrix:
            return "matrix";
        case QuestionType.MatrixSub:
            return "matrixalt";
        case QuestionType.Photo:
            return "photo";
        case QuestionType.Voice:
            return "voice";
        case QuestionType.MultiText:
            return "multitext";
        case QuestionType.LongList:
            return "longlist";
        case QuestionType.MatrixCustom:
            return "matrixcustom";
        default:
            return "check";
    }
}

module.exports.convertToSurveyRuleLogic = (type) => {
    switch (type) {
        case "1":
            return RuleLogic.HideQuestion;
        case "2":
            return RuleLogic.JumpQuestion;
        default:
            return RuleLogic.JumpQuestion;
    }
}

module.exports.convertRuleLogicToString = (type) => {
    switch (type) {
        case RuleLogic.HideQuestion:
            return "1";
        case RuleLogic.JumpQuestion:
            return "2";
        default:
            return "2";
    }
}