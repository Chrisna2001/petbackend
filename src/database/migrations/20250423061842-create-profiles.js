// migrations/YYYYMMDDHHMMSS-create-profiles.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key reference to users table'
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL to the profile image'
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User age in years',
        validate: {
          min: 0,
          max: 120
        }
      },
      sex: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: true,
        comment: 'User sex/gender identity'
      },
      currentLocation: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Current location of the user'
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
    await queryInterface.dropTable('profiles');
  }
};