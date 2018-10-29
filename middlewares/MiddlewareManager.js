var loginMiddleware = require('./LoginMiddleware');
var headerMiddleware = require('./HeaderMiddleware');

module.exports = (app) => {
    app.use(loginMiddleware);
    app.use(headerMiddleware);
}