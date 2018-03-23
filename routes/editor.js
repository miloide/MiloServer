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
 * Handles /editor/:project_id
 * Method: Get
 * Loads the specified project into the IDE
 */
router.get('/:project_id',isAuthenticated,function(req, res){

  // TODO: replace with value from DB
  var project = {
    id: req.params.project_id,
    title: "Hello World",
    collaborators: ["b@example.com"],
    public: false,
    owner: "a@a.com",
    xml:'<xml xmlns="http://www.w3.org/1999/xhtml">\
          <variables></variables>\
          <block type="text_log" id="MjeqC8lbf:o.P,qll_^;" x="178" y="63">\
            <value name="TEXT">\
              <shadow type="text" id="8EOJZ-C(A7b:g*(|IvzJ">\
                <field name="TEXT">Hello World</field>\
              </shadow>\
            </value>\
          </block>\
        </xml>'
  };

  res.render('ide',{user: req.user,project:project});
});


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
  res.render('ide',{user: req.user,project:project});
});

module.exports = router;
