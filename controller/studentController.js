const newTest = require('../models/newTest')
const Question = require('../models/question')
const commonResponses = require('../components/response/commonResponse');
const AttemptTest = require('../models/attemptTest')
var random = require('mongoose-random');

module.exports.getRandomQuiz = async function(req, res){
    try{     
        let isAttempted = await AttemptTest.findOne({testCode: req.body.code, user: req.user._id})
        if(isAttempted != null){
            return commonResponses.someMessage(res,'You have already attempted the Test')
        }
        let test = await newTest.findOne({testCode:req.body.code},{_id:0}).select('allQuestions attemptableQuestion totalQuestions').populate('allQuestions', 'qStatement option1 option2 option3 option4 correctAnswer')
        let questionList =[]
        let isVisited=[]
        for(var i=0;i< test.attemptableQuestion;i++)
        {
            isVisited[i]=false
        }
        var count = Number(0);
        while(count<test.attemptableQuestion){            
            let randomIndex = Math.floor(Math.random() * (test.attemptableQuestion));
            if(isVisited[randomIndex] == false){
                isVisited[randomIndex]=true
                questionList.push(test.allQuestions[randomIndex])
                count = count +1;
            }
        }
        
        let attemptedTest = AttemptTest.create({
            user: req.user._id,
            testCode: req.body.code,
            testScore: 0
        })
        return commonResponses.successWithData(res,questionList)    
    }catch(error){
        return commonResponses.internalError(res)
    }
}

module.exports.submitQuiz = async function(req, res){
    let test =  await newTest.findOne({testCode:req.body.code},{_id:0}).select('allQuestions attemptableQuestion totalQuestions').populate('allQuestions', 'qStatement option1 option2 option3 option4 correctAnswer')
    console.log(req.body)
    return res.send("hello")
}

module.exports.goToCourse = async function(req, res){
    let user 
}