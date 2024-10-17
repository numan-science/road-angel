'use strict';
const TABLE = 'workshop';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, 'workshopAttachments', {
      type: Sequelize.JSONB,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, 'workshopAttachments');
  },
  }