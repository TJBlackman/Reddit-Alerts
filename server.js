const express    = require('express')
    app          = express(),
    session      = require('express-session'),
    path         = require('path'),
    bodyParser   = require('body-parser'),
    mongoose     = require('mongoose'),
    schemas      = require('./schemas'),
    routes       = require('./routes'),
    queryReddit  = require('./queryReddit'),
    minute       = 60000,
    config       = require('./config'),
    sendAlert    = require('./sendAlert');




// update mongoose Promises to native Node.js Promises
mongoose.Promise = global.Promise;

// connect to DB
mongoose.connect(config.MONGO_URI, config.MONGO_OPTIONS);


// set up static folder
app.use(express.static(path.join(__dirname,"./public")));

// extra middleware
app.use(bodyParser.json());
app.use(session({
    secret:config.session.secret,
    resave:true,
    saveUninitialized: true,
    cookie: { maxAge: minute * 300, secure: false }
}));


routes(app);
setInterval(queryReddit, 60000)

// app is listening!
app.listen(config.PORT, function(){
    console.log('Server Live: '+config.PORT);
})
