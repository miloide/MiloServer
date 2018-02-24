var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const webpackHotMid = require("webpack-hot-middleware");

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

connect();
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
    res.render('editor');
});


app.post('/storage', function(req, res){
    var content = req.body;
    var key = Object.keys(content)[0];
    var value = content[key];
    if(key == 'xml'){
      var hash = Helpers.generateHash(value);
    }
    else
      return ;
});

app.get('/storage', function(req, res){
  console.log("GET request");
});

var httpServer = http.createServer(app);

httpServer.listen(3000, function(){
  console.log('Server listening on port 5000');
});

function connect () {
  var db =mongoose.connect('mongodb://localhost:27017/miloDB').connection;
  db.on('connected', console.log.bind("Connected"));
  db.on('error', console.error.bind("Database Connected error"));
  db.on('disconnected', connect);
  return db;
}