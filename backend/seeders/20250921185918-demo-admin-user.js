'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Insert the admin role
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          role_name: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // 2️⃣ Hash password for admin user
    const passwordHash = await bcrypt.hash('Admin@123', 10);

    // 3️⃣ Insert admin user
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

    // 5️⃣ Link user ↔ role in user_roles
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
    // Get IDs to delete relationships safely
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

    // Delete admin user
    await queryInterface.bulkDelete('users', {
      email: 'siddharthprasan652@gmail.com',
    });

    // Delete admin role
    await queryInterface.bulkDelete('roles', {
      role_name: 'ADMIN',
    });
  },
};
