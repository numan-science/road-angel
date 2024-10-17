'use strict';
const TABLE = 'business_case';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, 'participantB', {
      type: Sequelize.UUID,
    });
    await queryInterface.addColumn(TABLE, 'type', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, 'participantB');
    await queryInterface.removeColumn(TABLE, 'type');
  },
  }





