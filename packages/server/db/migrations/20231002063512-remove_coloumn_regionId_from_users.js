'use strict';
const TABLE = 'users';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, 'fkRegionId', {
      type: Sequelize.UUID,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, 'fkRegionId', {
      type: Sequelize.UUID,
    });
  },
  }
