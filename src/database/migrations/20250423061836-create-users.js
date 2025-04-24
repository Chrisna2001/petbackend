// migrations/YYYYMMDDHHMMSS-create-users.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Full name of the user'
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique username for login'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Email address of the user'
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Phone number with country code'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Hashed password'
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user',
        comment: 'User role for authorization'
      },
      access_token: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'JWT token for authentication'
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether the user account is verified'
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};