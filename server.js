'use strict';

// init framework
var express = require('express');
var app     = express();
var router  = express.Router();

// CORS
//var cors    = require('cors');
//app.use(cors());

// init essential
var path            = require('path');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var session         = require('express-session');
var cookies         = require('cookie-parser');
var morgan          = require('morgan');
var helmet          = require('helmet');
//var passport        = require('passport');
var favicon         = require('serve-favicon');
//var expressJwt      = require('express-jwt');
//var jwt             = require('jsonwebtoken');
var compression = require('compression');

// init database

// port
var port = process.env.PORT || 1122;

console.log(process.env.NODE_ENV);
//app.set('env', 'development');
var env = app.get('env');
if('development' === env) {
  app.use(morgan('dev'));
}

// essential middleware
app.use(compression());
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


// JWT
//app.set('jwtSecret', 'ramaibz123009');
//app.use('/api', expressJwt({ secret: app.get('jwtSecret') }));

// templating engine
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'dist')));

app.set('views', __dirname + '/dist/');
app.use('/', function(req, res) {
  if(env === 'production') {
    res.render('views/minified/index.html', { cdn: 'http://cdn.ramaibz.me' } );
  }
  else {
    //res.sendFile(path.join(__dirname, 'dist/views/', 'index.html'));
    res.render('views/index.html', { cdn: '' } );
  }
})

// start server
var server = app.listen(port, function () {
  var host = 'server';
  var port = server.address().port;
  console.log('listening at http://%s:%s on %s', host, port, env);
});
