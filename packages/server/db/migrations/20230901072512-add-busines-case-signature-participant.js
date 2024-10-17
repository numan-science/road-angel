'use strict';

const TABLE = 'business_case';
const COLUMN1 = 'participantAsignature';
const COLUMN2 = 'participantBsignature';



module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, COLUMN1, {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn(TABLE, COLUMN2, {
      type: Sequelize.TEXT,
    });
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, COLUMN1);
    await queryInterface.removeColumn(TABLE, COLUMN2);

   
  },
};