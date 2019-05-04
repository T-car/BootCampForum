// Dependencies
// =============================================================
var db = require("../models");

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('315ef01aca5a462b9e90a0f0f73b7ebf');

// Requiring Redis
var redis = require('redis');

// Calling Redis Client with Redis Enterprise Credentials (Free Account!)
var client = redis.createClient(14576, 'redis-14576.c100.us-east-1-4.ec2.cloud.redislabs.com', {
  no_ready_check: true
});
client.auth('oewZaurptwAknYpGQZnQPsaOm0cFYThu', function (err) {
  if (err) throw err;
});

// Logging Redis Connection Errors
client.on('connect', function () {
  console.log('Connected to Redis');
});

//================================================================================

// Caching function that will be used as middleware within the get route.
let redisCache = (req, res, next) => {
  let key = req.url;

  // “Client get” is calling the cache to see if it has this route stored.
  client.get(key, function (err, data) {

    //If stored, cache will render page.
    if (data) {
      res.send(data);

      //Otherwise, it will store it for future use.
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {

        //“Client set” stores route in cache. “Set ex” sets a timer (10 seconds here) that dictates how long route will be stored in the cache. 
        // After time is elapsed, route call will be sent to the cloud database as usual.
        client.setex(key, 10, JSON.stringify(body));
        res.sendResponse(body);
      }

      // This function passes control flow along to the following step in the get route, the call to the database.
      next();
    }
  });
};
//=====================================================================================

// Routes
// =============================================================
module.exports = function (app) {

  // Redis cache function used as middleware, to be executed before the call to the database is made, in case route is stored already in cache.
  app.get("/api/news", redisCache, function (req, res) {

    // Database call is wrapped in a set Timeout, simulating a long call to database, upon initial load, page should load within 3 seconds, will receive http status code 200. 
    // On subsequent route calls, route should now be stored in cache, render immediately with status code 304.
    // setTimeout(() => {

      ///////////////////////////////// REDIS CACHED NEWS API /////////////////////////////////////////////
      newsapi.v2.everything({
        q: 'Technology',
        from: '2019-05-03',
        language: 'en',
        sortBy: 'popularity'
      }).then(response => {

        res.send(response)
        // console.log(response);
      });
      /////////////////////////////////REDIS CACHED NEWS API ENDS //////////////////////////////////////////////

    // }, 3000);
  });

  // Get route for retrieving a single thread
  app.get("/api/edit/:id", function (req, res) {
    db.Forum.findOne({
        where: {
          id: req.params.id
        }
      }).then(function (data) {
        // res.json(data);
        res.render('edit_thread', {
          forums: data
        });
      })
      .catch(function (err) {
        console.log(err)
      })

  });

  // POST route for saving a new thread
  app.post("/api/forums", function (req, res) {
    db.Forum.create({
        post_title: req.body.post_title,
        post_body: req.body.post_body,
        CategoryId: req.body.CategoryId,
        forum_name: req.body.forum_name
      })
      .then(function (dbPost) {
        res.json(dbPost);
        console.log("New Thread Created!")
      
      });
  });

  // POST route for saving a new author/user as established by Cognito
  app.post("/api/author", function (req, res) {
    db.Author.create({
        // name: req.body.name,
        email: req.body.email,
        forum_name: req.body.forum_name
      })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // DELETE route for deleting threads
  app.delete("/api/forums/:id", function (req, res) {
    db.Forum.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });

  // PUT route for updating threads
  app.put("/api/forums/:id", function (req, res) {
    db.Forum.update(
      req.body, {
        where: {
          id: req.body.id
        }
      }).then(function (dbPost) {
      res.json(dbPost);
    });
  });

  // POST route for creating a new response

  app.post("/api/responses", function (req, res) {
    db.Response.create({
        post_response: req.body.post_response,
        AuthorForumName: req.body.forum_name,
        ForumId: req.body.ForumId
      })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // PUT route for updating responses
  app.put("/api/responses/:id", function (req, res) {
    db.Response.update(
      req.body, {
        where: {
          id: req.body.id
        }
      }).then(function (dbPost) {
      res.json(dbPost);
    });
  });


}; // end function