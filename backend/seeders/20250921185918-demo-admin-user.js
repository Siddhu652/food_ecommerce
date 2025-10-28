'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
<<<<<<< HEAD
    // 1️⃣ Insert the admin role
=======
>>>>>>> 3895b5c95b40d17bc79a12803c651abede26796a
    await queryInterface.bulkInsert(
      'roles',
      [
        {
<<<<<<< HEAD
          role_name: 'ADMIN',
=======
          role_name: 'admin',
>>>>>>> 3895b5c95b40d17bc79a12803c651abede26796a
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
         
      userName: 'Siddharth',
      email: 'siddharthprasan652@gmail.com',
      password: passwordHash,
      phoneNumber: '8525096124',
      createdAt: new Date(),
      updatedAt: new Date()

        },
      ],
      {}
    );

    // 4️⃣ Fetch inserted IDs (for MySQL, manual lookup)
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE role_name = 'ADMIN' LIMIT 1;`
    );
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
      `SELECT id FROM roles WHERE role_name = 'ADMIN' LIMIT 1;`
    );

    // Delete relation first (foreign key order)
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
