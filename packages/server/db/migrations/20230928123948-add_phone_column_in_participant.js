'use strict';
const TABLE = 'participant';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, 'ownerPhoneNumber', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, 'ownerPhoneNumber');
  },
  }