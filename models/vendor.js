'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Vendor.belongsTo(models.User, { foreignKey: "user_id" });
      Vendor.belongsTo(models.User, {foreignKey:"user_id"});
    }
  }
  Vendor.init({
    user_id: DataTypes.INTEGER,
    restaurant_name: DataTypes.STRING,
    license_number: DataTypes.STRING,
    address: DataTypes.TEXT,
    opening_time: DataTypes.TIME,
    closing_time: DataTypes.TIME,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Vendor',
  });
  return Vendor;
};