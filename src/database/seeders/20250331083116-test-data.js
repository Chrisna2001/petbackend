// src/database/seeders/XXXXXXXXXXXXXX-demo-tests.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tests', [
      {
        id: 'a1b2c3d4-1234-5678-9101-112131415161',
        name: 'John Doe',
        age: 30,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'b2c3d4e5-2345-6789-1011-121314151617',
        name: 'Jane Smith',
        age: 25,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tests', null, {});
  }
};