const routes = require('express').Router();
var Project = require('../models/project.js');
var uniqid = require('uniqid');
var bcrypt =  require('bcrypt');
var salt = bcrypt.genSaltSync(10);

/**
 * Handles requests to /storage/
 * Type is either save or load
 */
routes.post('/', function(req, res){
    var content = req.body;
    if (content.type == "save"){
        // Handle access control checks
        Project.findOne(
            {projectKey: content.projectKey},
            function(err,result){
                if (!err && result!=undefined){
                    if (req.user.email != result.owner){
                        var emailEscaped = req.user.email.replace(/\./g,'[dot]');
                        var collabAccess = result.collaborators[emailEscaped] || 'none';
                        if (collabAccess == 'none' || collabAccess == 'view'){
                            return res.send({status: 403,message:"You are not authorized to save!"});
                        }
                    }
                    // Trying to save an existing project
                    saveHandler(content,req,res,false);
                } else {
                    // A new project is being created
                    saveHandler(content,req,res);
                }
            }
        );
    } else if (content.type == "load"){
        loadHandler(content,req,res);
    } else {
        return res.status(500).send("Unknown request");
    }
});

function saveHandler(content, req, res,isNew=true){
    var projectName = content.projectName;
    var xml = content.xml;
    var pages = content.pages;
    var markdownPages = content.markdownPages;
    var hash = bcrypt.hashSync(xml, salt);
    var projectKey = content.projectKey.length==0?uniqid():content.projectKey;
    var project = {
        projectName:projectName,
        projectKey: projectKey,
        blocks:{xml:xml, hash:hash},
        pages: JSON.parse(pages),
        markdownPages: JSON.parse(markdownPages)
    };

    if (isNew){
        project.trashed = false;
        project.public = false;
        project.owner = req.user.email;
        project.collaborators = {};
    }

    Project.findOneAndUpdate(
        {projectKey: projectKey}, // search filter
        project, // document to insert or update
        {upsert: true, new: true, runValidators: true},
        function(err,result){
            if (err) {
                console.log("Save Failed!",err);
                return res.send({status: 500,message:err});
            }
            return res.send({status: 200, key: result.projectKey});
        }
    );
}

function loadHandler(content,req,res){
    var key = content.projectKey;
    Project.findOne({projectKey: key, trashed: false}, // search filter
        function(err, result){
            if (err || result == undefined){
                console.log("Load Failed!",err);
                return res.send({status: 500,message:err});
            }
            if (!req.isAuthenticated()){
                // For anonymous users
                if (result.public) {
                    return res.send({
                        status: 200,
                        projectKey: result.projectKey,
                        xml: result.blocks.xml,
                        project: result,
                        canModify: false,
                        canRename: false,
                        shared: true
                    });
                } else {
                    return res.send({status: 403,message:"You are not authorized to view this!"});
                }
            }
            // Check if owner
            var canModify = req.user.email == result.owner;
            var canRename = canModify;
            var shared = false;
            if (req.user.email != result.owner){
                var emailEscaped = req.user.email.replace(/\./g,'[dot]');
                if (result.collaborators[emailEscaped] == undefined && !result.public){
                    return res.send({status: 403,message:"You are not authorized to view this!"});
                }
                shared = true;
                canModify = result.collaborators[emailEscaped] != undefined?result.collaborators[emailEscaped] != 'view':false;
                canRename = result.collaborators[emailEscaped] != undefined?result.collaborators[emailEscaped] == 'admin':false;
            }

            return res.send({
                status: 200,
                projectKey: result.projectKey,
                xml: result.blocks.xml,
                project: result,
                canModify: canModify,
                canRename: canRename,
                shared: shared
            });
        }
    );
}

module.exports = routes;
