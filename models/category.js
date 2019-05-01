module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("Category", {
    // Giving the category model a name column of type STRING
    name: DataTypes.STRING
  });

  
  Category.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Category.hasMany(models.Forum, {
      onDelete: "cascade"
    });
  };

  return Category;
};