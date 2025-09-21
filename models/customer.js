'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.belongsTo(models.User, { foreignKey: "user_id" });
      
    }
  }
  Customer.init({
    user_id: DataTypes.INTEGER,
    home_address: DataTypes.TEXT,
    home_landmark: DataTypes.STRING,
    work_address: DataTypes.TEXT,
    work_landmark: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    pincode: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers'
  });
  return Customer;
};