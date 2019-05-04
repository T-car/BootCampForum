// Dependencies
// =============================================================
var path = require("path");
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  app.get('/documentation', function (req, res) {res.render('homework')});

  // GET route for homepage to load recent threads
  app.get('/', function (req, res) {
    db.Forum.findAll({
        limit: 3
      })
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

  // GET route to deliver all THREADS
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
    db.Forum.findOne({
        where: {
          id: req.params.id
        },
        include: [{
          model: db.Response,
          include: [{
            model: db.Author
          }]
        }]
      }).then(function (data) {
        // res.json(data);
        res.render('single-thread', {
          forums: data
        });
      })
      .catch(function (err) {
        console.log(err)
      })

  });
};