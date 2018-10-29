var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(bodyParser.json({ type: 'application/*+json' }))
require('./middlewares/MiddlewareManager')(app);
require('./routes/RouteManager')(app);


app.listen(8000);