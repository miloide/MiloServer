var express = require('express');
var router = express.Router();


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
      return next();
  }
  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM to login
  res.redirect('/users/login');
}

/**
 * Handles /editor/
 * Method: Get
 * Renders a blank IDE workspace
 */
router.get('/',isAuthenticated,function(req, res){
  var starterBlocks = '\
      <xml xmlns="http://www.w3.org/1999/xhtml">\
      <variables></variables>\
      </xml>';
  var newProj = req.query.new == undefined? false  : true;
  res.render('ide',{user: req.user,starterBlocks: newProj?starterBlocks:'', newProj: newProj});
});


module.exports = router;
