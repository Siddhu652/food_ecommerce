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

<<<<<<< HEAD
    // 2️⃣ Hash password for admin user
    const passwordHash = await bcrypt.hash('Admin@123', 10);

    // 3️⃣ Insert admin user
=======
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE role_name = 'admin' LIMIT 1;`
    );

    const passwordHash = await bcrypt.hash('Vengadesh652@', 3);

>>>>>>> 3895b5c95b40d17bc79a12803c651abede26796a
    await queryInterface.bulkInsert(
      'users',
      [
        {
<<<<<<< HEAD
         
      userName: 'Siddharth',
      email: 'siddharthprasan652@gmail.com',
      password: passwordHash,
      phoneNumber: '8525096124',
      createdAt: new Date(),
      updatedAt: new Date()

=======
          username: 'Siddharth',
          email: 'siddharthprasan652@gmail.com',
          password: passwordHash,
          phone: '8525096124',
          createdAt: new Date(),
          updatedAt: new Date(),
>>>>>>> 3895b5c95b40d17bc79a12803c651abede26796a
        },
      ],
      {}
    );

<<<<<<< HEAD
    // 4️⃣ Fetch inserted IDs (for MySQL, manual lookup)
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE role_name = 'ADMIN' LIMIT 1;`
    );
=======
    // 4️⃣ Get the inserted user id
>>>>>>> 3895b5c95b40d17bc79a12803c651abede26796a
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'siddharthprasan652@gmail.com' LIMIT 1;`
    );

<<<<<<< HEAD
    // 5️⃣ Link user ↔ role in user_roles
=======
>>>>>>> 3895b5c95b40d17bc79a12803c651abede26796a
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
<<<<<<< HEAD
    // Get IDs to delete relationships safely
=======
>>>>>>> 3895b5c95b40d17bc79a12803c651abede26796a
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'siddharthprasan652@gmail.com' LIMIT 1;`
    );
    const [adminRole] = await queryInterface.sequelize.query(
<<<<<<< HEAD
      `SELECT id FROM roles WHERE role_name = 'ADMIN' LIMIT 1;`
    );

    // Delete relation first (foreign key order)
=======
      `SELECT id FROM roles WHERE role_name = 'admin' LIMIT 1;`
    );

>>>>>>> 3895b5c95b40d17bc79a12803c651abede26796a
    if (adminUser.length && adminRole.length) {
      await queryInterface.bulkDelete('user_roles', {
        user_id: adminUser[0].id,
        role_id: adminRole[0].id,
      });
    }

<<<<<<< HEAD
    // Delete admin user
    await queryInterface.bulkDelete('users', {
      email: 'siddharthprasan652@gmail.com',
    });

    // Delete admin role
    await queryInterface.bulkDelete('roles', {
      role_name: 'ADMIN',
    });
=======
    await queryInterface.bulkDelete('users', { email: 'siddharthprasan652@gmail.com' });
    await queryInterface.bulkDelete('roles', { role_name: 'admin' });
>>>>>>> 3895b5c95b40d17bc79a12803c651abede26796a
  },
};
