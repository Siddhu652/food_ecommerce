"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vendors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      restaurant_name: {
        type: Sequelize.STRING,
      },
      license_number: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      city: {
        type: Sequelize.STRING,
      },
      landmark: {
        type: Sequelize.STRING,
      },
      restaurant_image: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },

      opening_time: {
        type: Sequelize.TIME,
      },
      closing_time: {
        type: Sequelize.TIME,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("vendors");
  },
};
