var entitySchema = {
    IsDeleted: {type: Boolean, default: false},
    CreateDate: {type: Date, default: Date.now},
};

module.exports = entitySchema;