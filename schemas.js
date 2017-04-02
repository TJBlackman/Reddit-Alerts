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
        ref: 'matchedPost'
    }]
});

var matchedPostSchema = new Schema({
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
var matchedPost = mongoose.model('matchedPost',matchedPostSchema);
var User = mongoose.model('user',userSchema);

module.exports = {
    'newSubreddit': newRedditAlert,
    'foundPosts':matchedPost,
    'user':User
};
