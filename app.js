var db = require('./config/database');
var express = require('express');
const app = express();
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var projectStorage = require('./routes/store');
const webpackHotMid = require("webpack-hot-middleware");
var expressValidator = require('express-validator');
var passport = require('passport');
var authConfig = require('./config/auth');
var users = require('./routes/users');
var editor = require('./routes/editor');



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

// Handle forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Setup Authentication backend
// TODO: replace secret from credentials.js
app.use(require('express-session')({
    secret: 'milo',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
authConfig(passport);
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


// Custom routes
app.use('/users', users);
app.use('/editor', editor);
app.use('/storage', projectStorage);


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
      return next();
  }
  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('/users/login');
}


// Root Handler
app.get('/',isAuthenticated, function(req, res){
    res.redirect('/users/projects');
});

try {
  db.connect('mongodb://localhost:27017/miloDB');
} catch (e){
  console.log(e.message);
}


var httpServer = http.createServer(app);

httpServer.listen(5000, function(){
  console.log('Server listening on port 5000');
});

module.exports = app;
