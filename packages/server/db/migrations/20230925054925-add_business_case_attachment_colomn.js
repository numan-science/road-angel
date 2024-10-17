'use strict';
const TABLE = 'business_case';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, 'workshopInvoiceAttachment', {
      type: Sequelize.JSONB,
    });
    await queryInterface.addColumn(TABLE, 'towServiceInvoiceAttachment', {
      type: Sequelize.JSONB,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, 'workshopInvoiceAttachment');
    await queryInterface.removeColumn(TABLE, 'towServiceInvoiceAttachment');
  },
  }