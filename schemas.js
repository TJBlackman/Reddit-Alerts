var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var subredditSchema = new Schema({
    sub: String,
    keyWords: Array,
    contact: String,
    contactMethod: String
});

var Subreddit = mongoose.model('Subreddit',subredditSchema);
module.exports = Subreddit;
