// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the posts
  app.get("/api/forums", function(req, res) {
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
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // Get route for retrieving a single post
  app.get("/api/edit/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Forum.findOne({
      where: {
        id: req.params.id
      }
      // include: [db.Author]
    }) .then(function (data) {
      // console.log("-------------------------" + "/n")
      // console.log(data.post_title);
      // console.log("-------------------------" + "/n")
      //res.json(data);
      res.render('edit_thread', {
        forums: data
      });
    })
    .catch(function (err) {
      console.log(err)
    })

});

  // POST route for saving a new post
  // app.post("/api/forums", function(req, res) {
  //   db.Forum.create({
  //     post_title: req.body.post_title,
  //     post_body: req.body.post_body
  //     // category: req.body.post_category
  //   })
  //   .then(function(dbPost) {
  //     res.json(dbPost);
  //   });
  // });

  // DELETE route for deleting posts
  app.delete("/api/forums/:id", function(req, res) {
    db.Forum.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // PUT route for updating posts
  app.put("/api/forums/:id", function(req, res) {
    db.Forum.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbPost) {
      res.json(dbPost);
    });
  });
};
