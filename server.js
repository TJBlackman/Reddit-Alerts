const express = require('express')
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    schemas = require('./schemas'),
    request = require('request');




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
    new schemas.saved({
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

// get all subbreddit saves from DB
function getSubs(){
    schemas.saved.find({}).exec(function(err,data){
        if (err) { console.log(err); return false; }


        data.forEach(function(obj){

            request('https://www.reddit.com/r/' + obj.sub + '.json', function (error, response, body) {
                if (error) { console.log('error:', error); return false; }

                var body = JSON.parse(body),
                    posts = [],
                    keyWords = obj.keyWords;

                body.data.children.forEach(function(post){
                    var title = post.data.title.toLowerCase();
                    for (var i = 0, iMax = keyWords.length; i < iMax; i += 1){
                        if (title.includes(keyWords[i])) {
                            posts.push({
                                title: post.data.title,
                                postComments: post.data.permalink,
                                url: post.data.url,
                                author: post.data.author,
                                matchedOn:keyWords[i]
                            });
                            break;
                        }
                    }
                });

                posts.forEach(function(obj){
                    schemas.matched.create(obj)
                    .then(function(x){console.log('saved: ', x)})
                    .catch(error)
                });
            });
        });
    });
}


// getSubs();
// var interval = setInterval(getSubs, 10000)




// app is listening!
app.listen(8080, function(){
    console.log('Server Live: 8080');
})
