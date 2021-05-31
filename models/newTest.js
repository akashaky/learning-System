const mongoose = require('mongoose');
const Question = require('./question')
const User = require('./user')

const testSchema = new mongoose.Schema({
    testName:{
        type:String,
        required:true
    },
    testCode:{
        type:Number,
        required:true
    },
    totalQuestions:{
        type:Number,
        required:true,
    },
    attemptableQuestion:{
        type:Number,
        required:true,
    },
    testTime:{
        type:Number,
    },
    isActive:{
        type:Number,
    },
    semester:{
        type:Number,
        required:true,
    },
    allQuestions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    attemptedUsers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
   
   
}, {
    timestamps:true
});


const newTest = mongoose.model('newTest', testSchema);

module.exports = newTest;