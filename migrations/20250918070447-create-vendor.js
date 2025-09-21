'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model: 'users',
          key:'id'
        }
      },
      restaurant_name: {
        type: Sequelize.STRING
      },
      license_number: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      opening_time: {
        type: Sequelize.TIME
      },
      closing_time: {
        type: Sequelize.TIME
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vendors');
  }
};