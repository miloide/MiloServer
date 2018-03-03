const routes = require('express').Router();
var db = require('../database').getdb();
var blockModel = require('../models/blocks.js');
var bcrypt =  require('bcrypt');
var salt = bcrypt.genSaltSync(10);

routes.post('/storage', function(req, res){
    var content = req.body;
    var key = Object.keys(content)[0];
    var value = content[key];

    if(key == 'xml'){
        var hash = bcrypt.hashSync(value, salt);
        var instance = new blockModel({xml:value, hash:hash});
        console.log(hash);
        instance.save(function(err){
            if(err)
                return res.status(500).send(err);                   
            console.log("Saved!");
            return res.send(hash);
        });     
    }
    else if(key == 'key'){
        var value = req.body.key;
        console.log(value);
        blockModel.findOne({'hash': value}, function(err, data){
            if(err){
                throw err;
            }
            else
                console.log(data.xml);
                return res.send(data.xml);
        });
    }
    else{
        return res.status(500).send("Unknown request");
    }
});

routes.get("/storage", function(req, res){
    // TODO(ayush) : When gallery view is implemented
    //retrieve all values using find function

});

module.exports = routes;