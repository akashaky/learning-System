
async function successWithData(res,data){
    return res.status(200).json({
        "status":{
            "code": 200,
            "message": "success"
        },
        "info": data
    })
}

function internalError(res){
    return res.status(500).json({"status":{
        "code":500,
        "message": "Internal server error"
    }});
}

function joiError(error, res){
    return res.status(400).json({status:{
        "code":400,
        "message": error.details[0].message
    }});  
}
function invalidUser (res) {
    return res.status(401).json({"status":{
        "code":401,
        "message": "Invalid email/ Password"
    }})                
}

module.exports.invalidUser= invalidUser;
module.exports.joiError = joiError;
module.exports.successWithData = successWithData;
module.exports.internalError = internalError;