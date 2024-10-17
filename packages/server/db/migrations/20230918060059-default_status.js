'use strict';
const TABLE = 'business_case';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, 'status', {
      type: Sequelize.TEXT,
      defaultValue: 'pending', 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, 'status');
  },
  }