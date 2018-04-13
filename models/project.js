var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
     projectKey :{
         type: String,
         required: true
     },
     owner : {
         type : String,
         required : true
     },
     collaborators : {
         type  : Schema.Types.Mixed,
         default: {} //key: email, value: 'view','edit' or 'admin'
     },
     blocks : storageSchema,
     public : {
         type : Boolean,
         required : true
     },
     trashed : {
        type : Boolean,
        default : false
     },
     pages : {
         type: [{type: String}],
         default: []
     },
     markdownPages : {
        type: [{type: String}],
        default: []
    }
}, {collection: 'projectStorage'});
module.exports = mongoose.model('projectStorage', projectSchema);
