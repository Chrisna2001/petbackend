'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pet_listings', {
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
        comment: 'Foreign key reference to user who created the listing'
      },
      petName: {
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
      type: {
        type: Sequelize.ENUM('dog', 'cat', 'bird', 'fish', 'reptile', 'other'),
        allowNull: false,
        comment: 'Type of pet (species category)'
      },
      breed: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Breed of the pet'
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Price of the pet in dollars'
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: 'Date of birth of the pet'
      },
      ownerName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Name of the pet owner'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Description of the pet and additional details'
      },
      petImageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL to the pet image'
      },
      licenseImageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL to the license image'
      },
      licenseNo: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'License number of the pet'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether the listing is active or sold/removed'
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
    await queryInterface.dropTable('pet_listings');
  }
};