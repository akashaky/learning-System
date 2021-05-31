const Viedo = require('../models/viedos')
const newTest = require('../models/newTest')
const Question = require('../models/question')
const AttemptTest = require('../models/attemptTest')
const commonResponses = require('../components/response/commonResponse');
module.exports.uploadViedo = function(req, res){
    // if(req.user.isAdmin == 0) return commonResponses.someMessage(res, "Only admin can add viedos")
    try{
        Viedo.uploadedViedo(req, res, async function(err){ 
            if(req.file == undefined){
                return commonResponses.fileRequired(res)
            }
            
            var uploadViedo = Viedo.viedoPath + '/' +  req.file.filename    
             let newViedo = await Viedo.create({
                 user: req.user._id,
                 semester: req.body.semester,
                 subject: req.body.subject,
                 viedo: uploadViedo,
                 displayName: req.body.displayName
            });
            return commonResponses.viedoUploaded(res)
        })
    }catch(error){
        
        return commonResponses.internalError(res)
    }
}

module.exports.createTest = async function(req, res){
    try{
        let newTests = await newTest.create({
            testName: req.body.testName,
            testCode: req.body.testCode,
            totalQuestions: req.body.totalQuestions,
            attemptableQuestion: req.body.attemptableQuestion,
            testTime: req.body.testTime,
            semester: req.body.semester,
            isActive:0
       });
       return commonResponses.newTestCreated(res)
    }catch(error){
        return commonResponses.internalError(res)
    }
}

module.exports.addQuestion = async function(req,res){
    try{
        let toTest = await newTest.findOne({testCode: req.body.testCode})
        if(toTest == null) return commonResponses.notFound(res)
        let newQuestion = await Question.create({
            qStatement: req.body.qStatement,
            option1: req.body.option1,
            option2: req.body.option2,
            option3: req.body.option3,
            option4: req.body.option4,
            correctAnswer: req.body.correctAnswer,
            
        })
        
        let addQuestion = await toTest.allQuestions.push(newQuestion)
        let toSave = await toTest.save()
        
        return commonResponses.successWithString(res,'Question Added')
    }catch(error){
        return commonResponses.internalError(res)
    }
    
}


module.exports.getTestResult = async function(req, res){
    let allTestAttemptedStudent = await AttemptTest.find({testCode: req.body.testCode}).select('user testScore').populate('user', 'firstname email')
    return commonResponses.successWithData(res, allTestAttemptedStudent)

}

module.exports.activateTest = async function(req,res){
    try{
        let test = await newTest.findOne({testCode: req.body.testCode})
        if(test == null) return commonResponses.notFound(res)
        test.isActive = 1
        let saveTest = await test.save()
        return commonResponses.successWithString(res,'Test is Active Now')
      
    }catch(err){
        console.log(err)
        return commonResponses.internalError(res)
    }
}


module.exports.deactivateTest = async function(req, res){
    try{
        let test = await newTest.findOne({testCode: req.body.testCode})
        if(test == null) return commonResponses.notFound(res)
        test.isActive = 0
        let saveTest = await test.save()
        return commonResponses.successWithString(res,'Test is No more Active now')
    }catch(err){
        return commonResponses.internalError(res)
    }
}
