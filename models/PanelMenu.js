var mongoose = require('mongoose');
var entity = require('./Entity');
var enums = require('./Enums');

var PanelMenu = new mongoose.Schema({
    ...entity,
    TopId: String,
    Title: String,
    ActionName: String,
    IconClass: String,
    RoleList: [Number],//enum: enums.SiteMemberType
    IsDisplayMenu: Boolean,
    Position: Number,
}, {collection: 'PanelMenus'});

module.exports = mongoose.model('PanelMenus', PanelMenu);