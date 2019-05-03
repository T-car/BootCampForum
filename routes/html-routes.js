// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads the home page
  app.get('/', function (req, res) {
    db.Forum.findAll()
      .then(function (data) {
        // console.log(data[0]);
        //res.json(data);
        res.render('index', {
          forums: data
        });
      })
      .catch(function (err) {
        console.log(err)
      })
  });


  // cms route loads cms.html
  // app.get('/thread', (req, res) => res.render('thread', { layout: 'main' }));

  // forum route loads forum.html
  app.get('/forum', function (req, res) {
    db.Forum.findAll()
      .then(function (data) {
        // console.log(data[0]);
        //res.json(data);
        res.render('thread', {
          forums: data
        });
      })
      .catch(function (err) {
        console.log(err)
      })

  });

  // GET route for retrieving a single thread
  app.get("/forum/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Forum.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: db.Response,
          include: [
            {
              model: db.Author
            }
          ]
        }]
    }).then(function (data) {
      // console.log("-------------------------" + "/n")
      // console.log(data.post_title);
      // console.log("-------------------------" + "/n")
      // res.json(data);
      res.render('single-thread', {
        forums: data
      });
    })
      .catch(function (err) {
        console.log(err)
      })

  });

  // authors route loads author-manager.html
  app.get("/authors", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/author-manager.html"));
  });
};

