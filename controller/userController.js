const User = require('../models/user');
const Otp = require('../models/otp')
const otpMailer = require('../mailer/otpMailer');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('@hapi/joi');
const commonResponses = require('../components/response/commonResponse');
const {checkEmail, checkCreateUser,checkSignIn} = require('../controller/inputValidations/authentication');

module.exports.generateOTP = async function(req, res){    
    try{   
        // const { error } = await checkEmail.validateAsync(req.body);  
        let user= await User.findOne({email: req.body.email});
        if(user) return res.status(401).json({"status":{
            "code":401,
            "message":"User with this email already exists"
        }})  
       
        console.log(req.body)
        if(!user){
            let userOtp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
            let createdOtp = await Otp.create({
                email: req.body.email,
                otp: userOtp
            });
            let res1 = await otpMailer.newOtpMail(req, res,userOtp);
            return commonResponses.successWithData(res,res1.accepted); 
        }  
       
       }catch(error){
           console.log(error)
            if(error.isJoi == true){return commonResponses.joiError(error,res)}
            return commonResponses.internalError(res);
        }
}

module.exports.verifyOTP = async function(req, res,next){
    try{
        let isValidOTP = await Otp.findOne({otp: req.body.Otp});
        if(!isValidOTP) return res.status(401).json({"status":{
            "code":200,
            "message": "Invalid OTP"
        }});
        next();
    }catch(err){ return commonResponses.internalError(res)}
}

module.exports.create = async function(req, res){
    try{
        const {error} =  await checkCreateUser.validateAsync(req.body);        
        let userEmail =  await Otp.findOne({otp:req.body.Otp}).select('email');
        let user= await User.findOne({email: userEmail.email});
        if(user) return res.status(400).json({"status":{
            "code":400,
            "message":"Your account has already been created"
        }})
        
        
         const salt = await bcrypt.genSalt(10);
         let ePassword = await bcrypt.hash(req.body.password, salt);
    
     
        let newUser = await User.create({
            firstname: req.body.firstname,
            lastname : req.body.lastname,            
            email: userEmail.email,
            password: ePassword,
            branch: req.body.branch, 
            semester: req.body.semester,
            isAdmin:0,
            score:0,
            level:1,
            
        })         

        const token = jwt.sign({_id: newUser._id, isAdmin: newUser.isAdmin, score: newUser.score, level:newUser.level}, 'jwtPrivateKey');
        return res.header('x-auth-token',token).status(200).json({
            "staus":{
                "code": 200,
                "messagae" : "User created"
            },
            data: _.pick(newUser, ['firstname', 'email'])
        });       
        
    }catch(error){ 
        if(error.isJoi == true){return commonResponses.joiError(error,res)}       
        return commonResponses.internalError(res)
    };
}


module.exports.signIn = async function(req, res){
    try{        
        const { error } = await checkSignIn.validateAsync(req.body); 
        let inputEmail = req.body.email;
        let user = await User.findOne({email: inputEmail})
        if(user == null){return commonResponses.invalidUser(res)}
        const ValidPassword = await bcrypt.compare(req.body.password, user.password);
        if(!ValidPassword){return commonResponses.invalidUser(res)}
        const token = jwt.sign({_id: user._id, isAdmin: user.isAdmin,email:user.email, score: user.score, level:user.level}, 'jwtPrivateKey', {expiresIn:3600000});
        return commonResponses.successWithData(res, token);
    }catch(error){
        if(error.isJoi == true){return commonResponses.joiError(error, res)}
        return commonResponses.internalError(res)
     }
}

module.exports.profile = async function (req, res){
    try {
        const user = await User.findById(req.user._id).select('-password -_id -__v -createdAt -updatedAt');
        
        return commonResponses.successWithData(res, user)
        } catch (err){
            return commonResponses.internalError(res)
        }   
}


module.exports.auth = function (req, res, next){
    try { 
        const token = req.header('x-auth-token');
        if(!token) return res.status(401).send('Accesss Denied. No token Provieded');
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        req.user = decoded;   
        next();
    } catch (ex) {
    res.status(400).send('Invalid Token');
    }

}
