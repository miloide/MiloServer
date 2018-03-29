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
router.get(['/'],isAuthenticated,function(req, res){

  // TODO: replace with call to create new project from model
  var project = {
    id: req.params.project_id,
    title: "Untitled Project",
    collaborators: [],
    public: false,
    owner: req.user.email,
    xml:""
  };
  res.render('ide',{user: req.user,starterBlocks: ''});
});

module.exports = router;
