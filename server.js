// *** Dependencies
// =============================================================
var express = require("express");
var exphbs = require("express-handlebars");
// var bodyParser = require('body-parser');
var path = require('path');

//Requiring Redis
var redis = require('redis');


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
// app.use(express.static("public"));

// // Body Parser
// app.use(bodyParser.urlencoded({ extended: false }));

// // Set static folder
app.use("/public", express.static(path.join(__dirname, 'public')));

// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/author-api-routes.js")(app);
require("./routes/forum-api-routes.js")(app);

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Syncing Sequelize & Express Server Start
// =============================================================
db.sequelize.sync({ }).then(function() { // { force: true } if models change
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
