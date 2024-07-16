'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Library, { foreignKey: "UserId" })
      // define association here
    }
  }
  User.init({
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
    status: {
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
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: "Email has been registered"
      },
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Email is required"
        },
        notNull: {
          msg: "Email is required"
        },
        isEmail: {
          msg: "Wrong email format"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required"
        },
        notNull: {
          msg: "Password is required"
        },
        length(){
          if (this.password.length < 5){
            throw new Error ('Minimum password length is 5.')
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};