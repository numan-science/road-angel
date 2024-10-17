'use strict';
const TABLE = 'business_case';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, 'customerParticipant', {
      type: Sequelize.UUID,
    });
    await queryInterface.addColumn(TABLE, 'culpritParticipant', {
      type: Sequelize.UUID,
    });
    await queryInterface.addColumn(TABLE, 'damageParticipant', {
      type: Sequelize.UUID,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, 'customerParticipant');
    await queryInterface.removeColumn(TABLE, 'culpritParticipant');
    await queryInterface.removeColumn(TABLE, 'damageParticipant');

  },
  }