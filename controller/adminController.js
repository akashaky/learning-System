const Viedo = require('../models/viedos')
const commonResponses = require('../components/response/commonResponse');
module.exports.uploadViedo = function(req, res){
    try{
        Viedo.uploadedViedo(req, res, async function(err){ 
            if(req.file == undefined){
                return commonResponses.fileRequired(res)
            }
            
            var uploadViedo = Viedo.viedoPath + '/' +  req.file.filename    
             let newViedo = await Viedo.create({
                 user: req.user._id,
                 semester: req.body.semester,
                 subject: req.body.semester,
                 viedo: uploadViedo
            });
            return commonResponses.viedoUploaded(res)
        })
    }catch(error){
        console.log(error)
        return commonResponses.internalError(res)
    }
}