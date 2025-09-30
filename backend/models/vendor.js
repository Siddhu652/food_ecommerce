"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vendor.init(
    {
      user_id: DataTypes.INTEGER,
      restaurant_name: DataTypes.STRING,
      license_number: DataTypes.STRING,
      address: DataTypes.TEXT,
      city: DataTypes.STRING,
      landmark: DataTypes.STRING,
      restaurant_image: DataTypes.STRING,
      opening_time: DataTypes.TIME,
      closing_time: DataTypes.TIME,
      latitude: DataTypes.DECIMAL(10, 7),
      longitude: DataTypes.DECIMAL(10, 7),

      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
        allowNull: false,
      },
    },
    
      {
      sequelize,
      modelName: "Vendor",   // <-- Capital V
      tableName: "vendors",  // optional but recommended
    }
    
  );
  return Vendor;
};
