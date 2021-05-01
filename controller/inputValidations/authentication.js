const Joi = require('@hapi/joi');

const checkEmail = Joi.object({
    email: Joi.string().email().lowercase().required(),
})

const checkCreateUser = Joi.object({
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    Otp: Joi.number().min(6).required(),
    branch: Joi.string().required(),
    semester: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.ref('password'),
})

const checkSignIn = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required()
})



module.exports = {
    checkSignIn,
    checkEmail,
    checkCreateUser
}