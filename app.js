var db = require('./config/database');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
const webpackHotMid = require("webpack-hot-middleware");
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development';

if (NODE_ENV  == 'development'){
  console.log("Development Environment");
  var devConfig = require("./webpack.dev.config.js");
  var webpack = require('webpack');
  var webpackDevMiddleware = require("webpack-dev-middleware");
  const compiler = webpack(devConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: "/"
  }));
  app.use(webpackHotMid(compiler));
}
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('express-session')({
    secret: 'milo',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/auth')(passport);
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.use(flash());
var users = require('./routes/users');
app.use('/users', users);
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
      return next();
  }
  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('/users/login');
}


app.get('/',isAuthenticated, function(req, res){
    res.render('ide');
});

try {
  //db.connect('mongodb://localhost:27017/miloDB');
} catch (e){
  console.log(e.message);
}

app.use('/', routes);
var httpServer = http.createServer(app);

httpServer.listen(5000, function(){
  console.log('Server listening on port 5000');
});

module.exports = app;
