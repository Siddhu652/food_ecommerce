'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
   
    static associate(models) {
      UserRoles.belongsTo(models.User,{
        foreignKey: "user_id"
      });
      UserRoles.belongsTo(models.Role,{
        foreignKey: "role_id"
      })
      
    }
  }
  UserRoles.init({
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserRole',
    tableName: "user_roles",
    indexes:[
      {
        unique: true,
        fields: ["user_id", "role_id"]
      }
    ]
  });
  return UserRoles;
};