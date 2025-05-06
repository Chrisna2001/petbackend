

// migrations/YYYYMMDDHHMMSS-create-appointments.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointments', {
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
        comment: 'User who made the appointment'
      },
      shopId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'shops',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Shop where the appointment is scheduled'
      },
      appointmentDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Date of the appointment'
      },
      appointmentTime: {
        type: Sequelize.TIME,
        allowNull: false,
        comment: 'Time of the appointment'
      },
      service: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Main service requested'
      },
      subServices: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        comment: 'Additional sub-services requested'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Additional notes for the appointment'
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Status of the appointment'
      },
      cancellationReason: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Reason for cancellation if cancelled'
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

    // Add indexes for faster queries
    await queryInterface.addIndex('appointments', ['userId']);
    await queryInterface.addIndex('appointments', ['shopId']);
    await queryInterface.addIndex('appointments', ['appointmentDate']);
    await queryInterface.addIndex('appointments', ['status']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('appointments');
  }
};