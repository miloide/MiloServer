const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const blocksSchema =new Schema({
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
},{collection: 'miloBlocks'});
const miloBlocks = module.exports = mongoose.model('miloBlocks', blocksSchema);