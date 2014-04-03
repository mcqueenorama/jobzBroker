var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var getRawBody = require('raw-body')
var uuid = require('uuid');

//http://lorenwest.github.io/node-config/latest/
var broker = require('config').broker;

var routes = require('./routes');
var tnetstrings = require('./lib/tnetstrings');

var zmq = require('zmq')
var pubUrl = 'tcp://*:' + broker.pub.port;
console.log('publishing to pubUrl:', pubUrl);
console.log('http bound to port:', broker.httpd.port);

var socket = zmq.socket('pub');

socket.identity = 'publisher' + process.pid;
socket.bind(pubUrl);

// console.log('connected!');

var app = express();

app.set('title', 'jobz broker');
app.set('port', broker.httpd.port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

//get rid of everything that's not right immediately
app.use(function (req, res, next) {

    if(req.query && req.query.job) {

        next();

    } else {

        next(new Error('No job name was specified: call me with a query string like this:?job=whatever'));
        
    }

});

//get the post body raw
app.use(function (req, res, next) {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: 'utf8'
  }, function (err, string) {
    if (err)
      return next(err)

    req.text = string
    next()
  })
});

app.use(app.router);

app.all('/' + broker.httpd.path, function(req, res, next) {

    var message = 'message ' + tnetstrings.tnetstrings.dumpObject({jobId: uuid.v1(), query: req.query, path: broker.httpd.path, headers: req.headers, body: req.text});
    console.log('tnetstrings', message);
    socket.send(message);

    // console.log('express', express)
    next();

});

app.all('/' + broker.httpd.path, routes.index);

/// error handlers

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
