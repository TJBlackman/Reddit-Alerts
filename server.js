const express    = require('express')
    app          = express(),
    path         = require('path'),
    bodyParser   = require('body-parser'),
    mongoose     = require('mongoose'),
    schemas      = require('./schemas'),
    routes       = require('./routes'),
    session      = require('express-session'),
    queryReddit  = require('./queryReddit'),
    minute       = 60000,
    config       = require('./config'),
    sendAlert    = require('./sendAlert');




// update mongoose Promises to native Node.js Promises
mongoose.Promise = global.Promise;

// connect to DB
mongoose.connect('mongodb://localhost/redditAlerts');

// set up static folder
app.use(express.static(path.join(__dirname,"./public")));

// extra middleware
app.use(bodyParser.json());
app.use(session({
    secret:'PK@xukBe-CS0$Q|FL*k@%=3^S',
    resave:true,
    saveUninitialized: true,
    cookie: { maxAge: minute * 5, secure: false }
}));

routes(app);

// app is listening!
app.listen(8080, function(){
    console.log('Server Live: 8080');
})
