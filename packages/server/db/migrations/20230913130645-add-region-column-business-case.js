'use strict';

const TABLE = 'business_case';
const COLUMN1 = 'fkRegionId';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const exists = await queryInterface.describeTable(TABLE);
    if (!exists[COLUMN1]) {
      await queryInterface.addColumn(TABLE, COLUMN1, {
        type: Sequelize.UUID,
      });
    }

    await queryInterface.addConstraint(TABLE, {
      fields: [COLUMN1],
      type: 'foreign key',
      name: 'business_case_fk6',
      references: {
        table: 'region',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, COLUMN1);
  },
};



