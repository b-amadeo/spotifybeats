'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Library extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Library.belongsTo(models.User, { foreignKey: "UserId" })
      Library.belongsTo(models.Song, { foreignKey: "SongId" })
      // define association here
    }
  }
  Library.init({
    UserId: {
      type: DataTypes.INTEGER
    },
    SongId: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Library',
  });
  return Library;
};