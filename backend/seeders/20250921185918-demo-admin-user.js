'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          role_name: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE role_name = 'admin' LIMIT 1;`
    );

    const passwordHash = await bcrypt.hash('Vengadesh652@', 3);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'Siddharth',
          email: 'siddharthprasan652@gmail.com',
          password: passwordHash,
          phone: '8525096124',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // 4️⃣ Get the inserted user id
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'siddharthprasan652@gmail.com' LIMIT 1;`
    );

    await queryInterface.bulkInsert(
      'user_roles',
      [
        {
          user_id: adminUser[0].id,
          role_id: adminRole[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'siddharthprasan652@gmail.com' LIMIT 1;`
    );
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE role_name = 'admin' LIMIT 1;`
    );

    if (adminUser.length && adminRole.length) {
      await queryInterface.bulkDelete('user_roles', {
        user_id: adminUser[0].id,
        role_id: adminRole[0].id,
      });
    }

    await queryInterface.bulkDelete('users', { email: 'siddharthprasan652@gmail.com' });
    await queryInterface.bulkDelete('roles', { role_name: 'admin' });
  },
};
