'use strict';

const TABLE = 'participant';
const COLUMN1 = 'otherLiabilityInsuranceCompanyName';
const COLUMN2 = 'otherDamageInsuranceCompanyName';
const COLUMN3 = 'otherAkaInsuranceCompanyName';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, COLUMN1, {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(TABLE, COLUMN2, {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(TABLE, COLUMN3, {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, COLUMN1);
    await queryInterface.removeColumn(TABLE, COLUMN2);
    await queryInterface.removeColumn(TABLE, COLUMN3);
  },
};
