const routes = require('express').Router();
var Project = require('../models/project.js');
var uniqid = require('uniqid');
var bcrypt =  require('bcrypt');
var salt = bcrypt.genSaltSync(10);

/**
 * Handles requests to /storage/
 */
routes.post('/', function(req, res){
    var content = req.body;
    if (content.type == "save"){
        // Handle access control checks
        Project.findOne(
            {projectKey: content.projectKey},
            function(err,result){
                if (!err && result!=undefined){
                    if (req.user.username != result.owner){
                        var collabAccess = result.collaborators[req.user.username] || 'none';
                        if (collabAccess == 'none'){
                            return res.send({status: 403,message:"You are not authorized to save!"});
                        }
                    }
                    saveHandler(content,req,res,false);
                } else {
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
    var hash = bcrypt.hashSync(xml, salt);
    var projectKey = content.projectKey.length==0?uniqid():content.projectKey;
    var project = {
        projectName:projectName,
        projectKey: projectKey,
        blocks:{xml:xml, hash:hash},
    };

    if (isNew){
        project.public = false;
        project.owner = req.user.username;
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
    Project.findOne({projectKey: key}, // search filter
        function(err, result){
            if (err){
                console.log("Load Failed!",err);
                return res.send({status: 500,message:err});
            }
            if (req.user.username != result.owner && !result.public){
                if (result.collaborators[req.user.username] == undefined){
                    return res.send({status: 403,message:"You are not authorized!"});
                }
            }
            return res.send({
                status: 200,
                projectKey: result.projectKey,
                xml: result.blocks.xml,
                project: result
            });
        }
    );
}

module.exports = routes;
