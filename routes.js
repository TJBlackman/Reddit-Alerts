var schemas = require('./schemas');

var homepage = function(req, res, next){
    res.render('index');
}

// find username, then check if password matches
var login = function(req, res, next){
    schemas.user.findOne({ 'username':req.body.username,}, function(error, foundUser){
        var response = '';
        if (error) {res.send(error); return false; }
        if (foundUser != null) {
            if ( foundUser.password === req.body.password ) {
                req.session.u = foundUser.username;
                req.session.p    = foundUser.phone;
                req.session.e    = foundUser.email;
                req.session.t  = foundUser.twitter;
                response = 'success';
            } else {
                response = 'User credentials do not match.';
            }
        } else {
            response = 'User not found.';
        }
        res.send(response);
    });
}

var newUser = function(req, res, next){
    schemas.user.findOne({'username':req.body.username}, function(error, foundUser){
        // return if username already exists
        if ( foundUser ) { res.send('User already exists.'); return false; }

        // else create user!
        schemas.user.create({
            username: req.body.username,
            password: req.body.password,
            phone: req.body.phone,
            email: req.body.email,
            twitter: req.body.twitter
        }, function(err, user){
            res.send('success')
        });
    });
}

// newAlertSchema
var createAlert = function(req, res, next){
    if ( ! req.session.u ) {
        res.send('User not logged in. Cannot create new Alert');
        return false;
    }
    // look for existing alert by the same user
    schemas.newSubreddit.findOne({sub:req.body.subreddit, createdBy:req.session.u}, function(err,foundReddit){
        if (err) { console.log('error',err); return false; }

        // if no results, create new alert
        if (foundReddit === null){
            var newAlert = schemas.newSubreddit.create({
                sub: req.body.subreddit,
                keyWords: req.body.keyWords,
                contact: req.body.contact,
                contactMethod: req.body.contactMethod,
                createdBy: req.session.u
            },function(err, alert){
                res.send('Alert created for /r/'+alert.sub);
            });
        } else {
            // else update everything but the subreddit itself
            schemas.newSubreddit.findByIdAndUpdate(
                foundReddit._id,
                {keyWords: req.body.keyWords},
                {new:true},
                function(err, updatedReddit){
                    if (err) console.log('error', err);
                    res.send('Updated alert for /r/'+foundReddit.sub);
                }
            );
        }
    });
}

var checkLogin = function(req, res, next){
    var loggedIn = false;
    if (req.session.u) { loggedIn = true; }
    res.send(loggedIn);
}

var userData = function(req, res, next){
    (!req.session.u) ? res.send('Unauthorized') : res.send(req.session[req.body.data]);
}

var getNotifications = function(req, res, next){
    if (!req.session.u) {res.send('Unauthorized'); return false; }

    schemas.notifications.find({'createdBy':req.session.u}, function(er, list){
        res.send(list);
    });
}

var updateNotification = function(req, res, next){
    if (!req.session.u) { res.send('Unauthorized'); return false; }

    schemas.notifications.findByIdAndUpdate(req.body._id, req.body, function (error, updatedItem){
        if (error) { res.send(error); } else { res.send('Notification updated!'); }
    });
}
var deleteNotification = function(req, res, next){
    if (!req.session.u) { res.send('Unauthorized'); return false; }

    schemas.notifications.findByIdAndRemove(req.body.id, function(err, success){
        if (err) { res.send(error); } else { res.send('Notification deleted!'); }
    })
}


module.exports = function(app){
    app.get('/', homepage);
    app.get('/checklogin', checkLogin);
    app.get('/getNotifications', getNotifications)
    app.post('/createalert', createAlert);
    app.post('/newuser', newUser);
    app.post('/login', login);
    app.post('/getUserData', userData);
    app.put('/updateNotification', updateNotification)
    app.delete('/deleteNotification', deleteNotification)
}
