# Reddit-Alerts
#
#

#### About
Reddit Alerts is a server rendered app allowing users to set personalized alerts for keywords on subreddits. The app allows users to register an account, enter a comma separated list of search terms, and a valid subreddit. The server then checks that subreddit for new posts that include one or more keywords in the title every minute. When a matching post is found, the post is record along wih all he keywords that were a match. A logged in user can quickly scroll down the list of all the posts in all their subreddits that matched on a keyword, and click a link to go directly to the post or the the post's author's profile. 


#### Start Up
With a local instance of MongoDB running, simply run `node server.js`, and as long as your `config.js` file is complete, you will be able to visit the site via `localhost:PORT`, where `PORT` is the port number specified in your config file.

#### Technology
###### Front end
- HTML 5
- CSS 3
- jQuery
- Bootstrap 3.x
###### Back end
- Node.js
- Express
- MongoDB
- Mogoose

#
#
_This project is no longer maintained. It was primarily a learning project. A significant amount of knowledge and experience was gained from building this app._