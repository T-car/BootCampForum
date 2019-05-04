// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all of the threads
  app.get("/api/forums", function (req, res) {
    var query = {};
    if (req.query.author_id) {
      query.AuthorId = req.query.author_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Forum.findAll({
      where: query,
      include: [db.Author]
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });

  // Get route for retrieving a single thread
  app.get("/api/edit/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Forum.findOne({
      where: {
        id: req.params.id
      }
      // include: [db.Author]
    }).then(function (data) {
      // console.log("-------------------------" + "/n")
      // console.log(data.post_title);
      // console.log("-------------------------" + "/n")
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
      });
  });

  // POST route for saving a new thread
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
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // PUT route for updating responses
 app.put("/api/responses/:id", function (req, res) {
  db.Response.update(
    req.body,
    {
      where: {
        id: req.body.id
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
});

}; // end function

 