var db = require('./database');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
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
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
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
