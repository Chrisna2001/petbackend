'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pets', {
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
        comment: 'Foreign key reference to user who owns the pet'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Name of the pet'
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Age of the pet in years'
      },
      sex: {
        type: Sequelize.ENUM('male', 'female', 'unknown'),
        allowNull: true,
        defaultValue: 'unknown',
        comment: 'Sex of the pet'
      },
      breed: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Breed of the pet'
      },
      type: {
        type: Sequelize.ENUM('dog', 'cat', 'bird', 'fish', 'reptile', 'other'),
        allowNull: false,
        comment: 'Type of pet (species category)'
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: 'Date of birth of the pet'
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL to the pet image'
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
    await queryInterface.dropTable('pets');
  }
};