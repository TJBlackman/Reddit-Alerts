var express = require('express')
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Subreddit = require('./schemas');


// update mongoose Promises to native Node.js Promises
mongoose.Promise = global.Promise;

// connect to DB
mongoose.connect('mongodb://localhost/redditAlerts');

// set up static folder
app.use(express.static(path.join(__dirname,"./public")));
app.use(bodyParser.json());

// home page
app.get('/', (req, res) => res.render('index'));

// receive request from broswer, create new modal instance,
// save to DB, send updated Doc to browser
app.post('/createalert', function(req, res, next){
    console.log(req.body);
    new Subreddit({
        sub: req.body.subreddit,
        keyWords: req.body.keyWords,
        contact: req.body.contact,
        contactMethod: req.body.contactMethod
    })
    .save()
    .then(function(newlyCreatedSub){
        console.log(newlyCreatedSub);
        res.send('done');
    })
    .catch(next);
});




// app is listening!
app.listen(8080, function(){
    console.log('Server Live: 8080');
})
