const nodemailer    = require('nodemailer'),
    config          = require('./config');



var sendEmail = function(address, msg){
    let transporter = nodemailer.createTransport({
        service: 'Yahoo',
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });
    let mailOptions = {
        from: '"Reddit Alerts" <TrevorJBlackman@yahoo.com>',
        to: address,
        subject: 'Reddit Alerts | You have an Alert!',
        html: msg
    }
    transporter.sendMail(mailOptions, function(error, info){
        error ? console.log(error) : console.log('Email Sent!');
    });
}


module.exports = {
    email: sendEmail
}
