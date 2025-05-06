// migrations/YYYYMMDDHHMMSS-create-shop-schedules.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('shop_schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        comment: 'Foreign key reference to shop'
      },
      day: {
        type: Sequelize.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        allowNull: false,
        comment: 'Day of the week'
      },
      openTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '09:00:00',
        comment: 'Opening time'
      },
      closeTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '18:00:00',
        comment: 'Closing time'
      },
      isOpen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the shop is open on this day'
      },
      slotDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60,
        comment: 'Slot duration in minutes'
      },
      maxAppointmentsPerSlot: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Maximum appointments per slot'
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
    await queryInterface.dropTable('shop_schedules');
  }
};