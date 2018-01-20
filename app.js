var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var http = require('http');
var https = require('https');
var serveIndex = require('serve-index');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});


/*var server = app.listen(443, function(){
 console.log('Server listening on port 80');
});*/

var httpServer = http.createServer(app);

httpServer.listen(5000, function(){
  console.log('Server listening on port 5000');
});
