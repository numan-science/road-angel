'use strict';
const TABLE = 'insurance_companies';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, 'fkRoleId', {
      type: Sequelize.UUID,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, 'fkRoleId');
  },
  }
