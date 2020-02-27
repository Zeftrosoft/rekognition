//taskkill /F /IM node.exe
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();


var accountController = require('./controllers/account');
var faceController = require('./controllers/face');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "http://localhost:"+config.client);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,HEAD");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
var path = process.env.LOCAL_DB_STRING

mongoose.connect(path, function (err, db) {
    if(err) console.log(err);
    else console.log('Connected To Db')
});

app.get('/account', accountController.index)
app.get('/account/all', accountController.getAllAccounts)
app.get('/account/id/:_id', accountController.getAccountById)
app.post('/account', accountController.upsertAccount)
app.get('/face', faceController.index)
app.get('/face/all', faceController.getAllFaces)
app.get('/face/id/:_id', faceController.getFaceById)
app.post('/face', faceController.upsertFace)




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
