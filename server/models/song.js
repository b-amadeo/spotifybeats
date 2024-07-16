'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Song.hasMany(models.Library, { foreignKey: "SongId" })
      // define association here
    }
  }
  Song.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required"
        },
        notNull: {
          msg: "Name is required"
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Image is required"
        },
        notNull: {
          msg: "Image is required"
        }
      }
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "File is required"
        },
        notNull: {
          msg: "File is required"
        }
      }
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Desc is required"
        },
        notNull: {
          msg: "Desc is required"
        }
      }
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Status is required"
        },
        notNull: {
          msg: "Status is required"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};