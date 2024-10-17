
'use strict';

const TABLE = 'business_case';
const COLUMN1 = 'casenumber';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, COLUMN1, {
      type: Sequelize.STRING,
    });

   
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, COLUMN1);
   
  },
};
