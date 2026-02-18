'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {

    // 1. Insert role
    await queryInterface.bulkInsert(
      'roles',
      [{
        role_name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      { ignoreDuplicates: true }
    );

    // 2. Insert user
    const passwordHash = await bcrypt.hash('Vengadesh652@', 10);

    await queryInterface.bulkInsert(
      'users',
      [{
        userName: 'Siddharth',
        email: 'siddharthprasan652@gmail.com',
        password: passwordHash,
        phoneNumber: '8525096124',
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      { ignoreDuplicates: true }
    );

    // 3. Fetch IDs
    const [[adminRole]] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE role_name = 'admin' LIMIT 1`
    );

    const [[adminUser]] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'siddharthprasan652@gmail.com' LIMIT 1`
    );

    // 4. Assign role
    await queryInterface.bulkInsert(
      'user_roles',
      [{
        user_id: adminUser.id,
        role_id: adminRole.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      { ignoreDuplicates: true }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user_roles', null, {});
    await queryInterface.bulkDelete('users', { email: 'siddharthprasan652@gmail.com' });
    await queryInterface.bulkDelete('roles', { role_name: 'admin' });
  },
};
