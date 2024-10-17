'use strict';
const BUSINESSCASE_ACTIVITY = 'business_case_activity';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable(BUSINESSCASE_ACTIVITY, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
          allowNull: false,
        },
        fkBusinessCaseId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        actions: {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        fkCreatedBy: { type: Sequelize.UUID, allowNull: true },
        fkUpdatedBy: { type: Sequelize.UUID },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
        },
        deletedAt: { type: Sequelize.DATE },
      })
      .then(() =>
        queryInterface.addConstraint(BUSINESSCASE_ACTIVITY, {
          fields: ['fkBusinessCaseId'],
          type: 'foreign key',
          name: 'business_case_activity_fk0',
          references: {
            table: 'business_case',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )
      .then(() =>
        queryInterface.addConstraint(BUSINESSCASE_ACTIVITY, {
          fields: ['fkCreatedBy'],
          type: 'foreign key',
          name: 'business_case_activity_fk1',
          references: {
            table: 'users',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )
      .then(() =>
        queryInterface.addConstraint(BUSINESSCASE_ACTIVITY, {
          fields: ['fkUpdatedBy'],
          type: 'foreign key',
          name: 'business_case_activity_fk2',
          references: {
            table: 'users',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      );
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(BUSINESSCASE_ACTIVITY);
  },
};
