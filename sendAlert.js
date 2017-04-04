const nodemailer    = require('nodemailer'),
    config          = require('./config'),
    twilio          = require('twilio'),
    Twit            = require('twit'),
    twitterClient   = new Twit({
        consumer_key: config.twitter.consumerKey,
        consumer_secret: config.twitter.consumerSecret,
        access_token: config.twitter.accessToken,
        access_token_secret: config.twitter.tokenSecret
    });


// === Twitter Function ====
// =========================
var sendTweet = function(){
    twitterClient.post('statuses/update', {status: 'Hello World!'}, function(err, data, resp){
        if (err) {
            console.log(err);
        } else {
            console.log('Twitter Sent!');
        }
    });
}


// ==== EMAIL ALERT SENDER ====
// ============================
var sendEmail = function(address, msg){
    // configure email client
    let transporter = nodemailer.createTransport({
        service: 'Yahoo',
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });
    // configure message details
    let mailOptions = {
        from: '"Reddit Alerts" <TrevorJBlackman@yahoo.com>',
        to: address,
        subject: 'Reddit Alerts | You have an Alert!',
        html: msg
    }
    // send!
    transporter.sendMail(mailOptions, function(error, info){
        error ? console.log(error) : console.log('Email Sent!');
    });
}

// ==== TEXT FUNCTION ====
// =======================
const sendText = function(phone, alert){
    const twilioClient = twilio(config.twilio.accountSid, config.twilio.auth);
    twilioClient.messages.create({
        to: phone,
        from: config.twilio.number,
        body: "Reddit Alert: " +alert
    }, function(err, message){
        if (err) console.log(err);
    });
}


module.exports = {
    email: sendEmail,
    text: sendText,
    tweet: sendTweet
}
