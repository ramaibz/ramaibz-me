'use strict';

// init framework
var express = require('express');
var app     = express();
var router  = express.Router();

// CORS
//var cors    = require('cors');
//app.use(cors());

// init essential
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var cookies = require('cookie-parser');
var morgan = require('morgan');
var helmet = require('helmet');
var csurf = require('csurf');
//var passport        = require('passport');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var compression = require('compression');
var config = require('./config/env.js');

// init database

// port
var port = process.env.PORT || 1122;

//app.set('env', 'development');

// essential middleware
app.use(helmet());
app.use(cookies('ramaibz', {
  httpOnly: true,
  secure: true
}));
app.use(session({
  secret: 'ramaibz',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(favicon(__dirname + '/dist/indonesia.ico'));
// JWT
//app.set('jwtSecret', 'ramaibz123009');
//app.use('/api', expressJwt({ secret: app.get('jwtSecret') }));

// templating engine
app.engine('html', require('ejs').renderFile);
app.use(compression());
app.use(express.static(path.join(__dirname, 'dist')));

app.set('views', __dirname + '/dist/');

var env = app.get('env');
var config_var = function(cdn, suffix, gz) {
  return { cdn: cdn, suffix: suffix, gzip: gz };
};

var dbpath, renderfile, cdn, indexfile;
if('development' === env) {
  app.use(morgan('dev'));
  dbpath = config.development.db;
  indexfile = 'views/index.html';
  cdn = config_var();
}
if(env === 'production') {
  dbpath = config.production.db;
  indexfile = 'views/minified/index.html';
  cdn = config_var('https://d1ageymrjbrol5.cloudfront.net', '.min', '.gz');
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
mongoose.connect(dbpath, function(err, res) {
  if(err) {
    console.log(err)
  }
  else {
    console.log('connected to ' + dbpath);
  }
})

app.use('/gate', function(req, res) {
  res.render('views/login.html', cdn);
});

app.use('/home', function(req, res) {
  res.render('views/index.html', cdn);
});

app.use('/', function(req, res) {
  res.render(indexfile, cdn);
})

// start server
var server = app.listen(port, function () {
  var host = 'server';
  var port = server.address().port;
  console.log('listening at http://%s:%s on %s', host, port, env);
});
