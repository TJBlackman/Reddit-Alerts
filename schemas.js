var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var savedRedditSchema = new Schema({
    sub: String,
    keyWords: Array,
    contact: String,
    contactMethod: String
});

var matchedPostSchema = new Schema({
    title: String,
    urlComments:String,
    url: String,
    author: String,
    matchedOn:String
});

var userSchema = new Schema({
    username: String,
    password: String,
    phone: String,
    email: String,
    twitter: String
});

var savedReddit = mongoose.model('savedReddit',savedRedditSchema);
var matchedPost = mongoose.model('matchedPost',matchedPostSchema);
var User = mongoose.model('user',userSchema);

module.exports = {
    'subToMonitor': savedReddit,
    'foundPosts':matchedPost,
    'user':User
};
