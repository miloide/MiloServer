var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const storageSchema =new Schema({
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
},{collection: 'blockStorage'});

const blockStorage = module.exports = mongoose.model('blockStorage', storageSchema);
