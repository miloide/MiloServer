const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const blocksSchema =new Schema({
    url:{
        type: String,
        required:false
    },
    hash:{
        type: String,
        required:true
    },
    key:{
        type: String,
        required: false
    }, 
    xml:{
        type: String,
        required: true
    }
});
const miloBlocks = module.exports = mongoose.model('miloBlocks', blocksSchema);