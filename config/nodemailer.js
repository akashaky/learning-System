const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const config = require('config')


let transporter = nodemailer.createTransport({
    service : 'gmail',
    host : 'smtp.gmail.com',
    port : 587,
    secure: false,
    auth: {
        user : 'boostmindgame',
        pass : config.get('password')
    }
});

  module.exports = {
    transporter : transporter     
  }