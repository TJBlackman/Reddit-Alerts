var schemas = require('./schemas');

module.exports = function(app){
    app.get('/', homepage);
    app.post('/createalert', createAlert);
    app.post('/newuser', newUser);
}


var homepage = function(req, res, next){
    res.render('index');
}
var createAlert = function(req, res, next){
    schemas.subToMonitor.create({
        sub: req.body.subreddit,
        keyWords: req.body.keyWords,
        contact: req.body.contact,
        contactMethod: req.body.contactMethod
    },function(err, user){
        res.send('Alert created!')
    });
}


var newUser = function(req, res, next){
    schemas.user.findOne({'username':req.body.username}, function(error, foundUser){
        // return if username already exists
        if (foundUser) { res.send('User already exists.'); return; }
        // else create user!
        schemas.user.create({
            username: req.body.username,
            password: req.body.password,
            phone: req.body.phone,
            email: req.body.email,
            twitter: req.body.twitter
        }, function(err, user){
            res.send('User created!')
        });
    });

}
