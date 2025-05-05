'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('shops', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Shop username for login'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Hashed password for shop login'
      },
      storeName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Name of the shop/store'
      },
      ownerName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Name of the shop owner'
      },
      gstinNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'GSTIN (Goods and Services Tax Identification Number)'
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Contact phone number'
      },
      zone: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Geographical zone where the shop is located'
      },
      servicesOffered: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        comment: 'List of services offered by the shop'
      },
      servicesSubcategories: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        comment: 'Subcategories of services'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Description of the shop and its services'
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL to the shop profile image'
      },
      access_token: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'JWT token for authentication'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether the shop is active or not'
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether the shop has been verified by admin'
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
    await queryInterface.dropTable('shops');
  }
};