'use strict';
const bcrypt = require('bcrypt')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const passwordHash = await bcrypt.hash("siddhu652@", 10); 
    
    return queryInterface.bulkInsert('users', [{
      userName: 'Siddharth',
      email: 'siddharthprasan652@gmail.com',
      password: passwordHash,
      phoneNumber: '8525096124',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('users', { email: 'siddharthprasan652@gmail.com' }, {});

  }
};
