'use strict';
const TABLE = 'accident_case_documents';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, 'culpritParticipantSign', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn(TABLE, 'damageParticipantSign', {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, 'culpritParticipantSign');
    await queryInterface.removeColumn(TABLE, 'damageParticipantSign');

  },
  }