var express = require('express');
var router = express.Router();


/**
 * Handles /editor/
 * Method: Get
 * Renders a blank IDE workspace
 */
router.get('/',function(req, res){
  var starterBlocks = '\
      <xml xmlns="http://www.w3.org/1999/xhtml">\
      <variables></variables>\
      </xml>';
  var newProj = req.query.new == undefined? false  : true;
  if (req.isAuthenticated()){
    res.render('ide',{user: req.user,starterBlocks: newProj ? starterBlocks : '', newProj: newProj});
  } else {
    res.render('ide',{starterBlocks: starterBlocks , newProj: true});
  }

});


module.exports = router;
