module.exports = function (sequelize, DataTypes) {
  var Response = sequelize.define("Response", {
    post_response: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10]
      }
    }
  });
  Response.associate = function (models) {
    // A response should belong to a forum post
    Response.belongsTo(models.Forum, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  Response.associate = function (models) {
    // A response should belong to a forum post
    Response.belongsTo(models.Author, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Response;
}