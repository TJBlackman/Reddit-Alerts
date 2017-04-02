var schemas = require('./schemas'),
    request = require('request');

// get ALL subbreddit saves from DB, include the matchedPosts for each of them
module.exports = function(){
    schemas.newSubreddit.find({}).populate('matchedPosts').exec(function(err,data){
        if (err) { console.log(err); return false; }

        // request each of them from reddit
        data.forEach(function(subreddit){
            request('https://www.reddit.com/r/' + subreddit.sub + '.json', function (error, response, body) {
                if (error) { console.log(error); return false; }

                var body = JSON.parse(body),
                    redditPosts = body.data.children,
                    posts = [],
                    keyWords = subreddit.keyWords;

                // test the resulting subreddit posts' titles for matching keywords
                redditPosts.forEach(function(post){
                    var title = post.data.title.toLowerCase();
                    for (var i = 0, iMax = keyWords.length; i < iMax; i += 1){
                        if (title.includes(keyWords[i])) {
                            posts.push({
                                title: post.data.title,
                                postComments: post.data.permalink,
                                url: post.data.url,
                                author: post.data.author,
                                matchedOn:keyWords[i],
                                createdBy:subreddit.createdBy
                            });
                            break;
                        }
                    }
                });

                posts.forEach(function(post){
                    // see if exact matching url already exists, don't record duplicate
                    if (JSON.stringify(subreddit.matchedPosts).includes(post.url)) {
                        console.log('DUPLICATE, '+subreddit.createdBy+', '+post.url);
                        return false;
                    }

                    // else, save new reddit post!
                    schemas.foundPosts.create(post)
                    .then(function(savedPost){
                        subreddit.matchedPosts.push(savedPost._id);
                        schemas.newSubreddit.findByIdAndUpdate(subreddit._id, {matchedPosts: subreddit.matchedPosts}, function(){
                            console.log('NEW POST, '+subreddit.createdBy+', '+post.url);
                        });
                    }).catch(error)
                });
            });
        });
    });
}
