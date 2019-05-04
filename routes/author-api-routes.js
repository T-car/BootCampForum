var db = require("../models");

module.exports = function(app) {
  app.get("/api/category", function(req, res) {
   
    db.Category.findAll({
      include: [db.Forum]
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });
};
