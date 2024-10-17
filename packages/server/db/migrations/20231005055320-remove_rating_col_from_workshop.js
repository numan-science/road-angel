'use strict';
const TABLE = 'workshop';

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






