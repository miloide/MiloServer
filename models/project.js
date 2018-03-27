var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blocks = require('./blocks.js');
var storageSchema =new Schema({
    hash:{
        type: String,
        required:true
    },
    xml:{
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

var projectSchema = new Schema({
     projectName : {
         type : String,
         required : true
     },
     owner : {
         type : String,
         required : true
     },
     collaborators : {
         type  : Array,
         required : false
     },
     block : storageSchema,

     public : {
         type : Boolean,
         required : true
     }
}, {collection: 'projectStorage'});
const projectStorage = module.exports = mongoose.model('projectStorage', projectSchema);
