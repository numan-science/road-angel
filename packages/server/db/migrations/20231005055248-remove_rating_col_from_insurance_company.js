'use strict';
const TABLE = 'insurance_companies';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, 'rating', {
      type: Sequelize.FLOAT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, 'rating');
  },
  }
