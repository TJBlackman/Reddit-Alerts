var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var newRedditAlertSchema = new Schema({
    sub: String,
    keyWords: Array,
    contact: String,
    contactMethod: String,
    createdBy: {
        type: String,
        required: true
    },
    matchedPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'notification'
    }]
});

var redditNotificationSchema = new Schema({
    title: String,
    urlComments:String,
    url: String,
    author: String,
    matchedOn:String,
    createdBy: {
        type: String,
        required: true
    }
});

var userSchema = new Schema({
    username: String,
    password: String,
    phone: String,
    email: String,
    twitter: String
});

var newRedditAlert = mongoose.model('newRedditAlert',newRedditAlertSchema);
var notification = mongoose.model('notification',redditNotificationSchema);
var User = mongoose.model('user',userSchema);

module.exports = {
    'newSubreddit': newRedditAlert,
    'notifications': notification,
    'user': User
};
