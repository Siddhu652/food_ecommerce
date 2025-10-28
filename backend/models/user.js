"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Vendor, { foreignKey: "user_id" });
      User.hasOne(models.Customer, { foreignKey: "user_id" });
        User.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: "user_id",
      });
    }
  }
  User.init(
    {
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
<<<<<<< HEAD
      phoneNumber: DataTypes.STRING,
=======
      phone: DataTypes.STRING,
>>>>>>> 3895b5c95b40d17bc79a12803c651abede26796a
      refreshToken: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
