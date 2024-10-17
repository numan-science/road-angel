'use strict';
const BUSINESS_CASE_TOW_SERVICE = 'business_case_tow_service';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable(BUSINESS_CASE_TOW_SERVICE, {
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
        fkTowServiceId: {
          type: Sequelize.UUID,
          allowNull: false,
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
        queryInterface.addConstraint(BUSINESS_CASE_TOW_SERVICE, {
          fields: ['fkBusinessCaseId'],
          type: 'foreign key',
          name: 'business_case_tow_service_fk0',
          references: {
            table: 'business_case',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )


      .then(() =>
        queryInterface.addConstraint(BUSINESS_CASE_TOW_SERVICE, {
          fields: ['fkTowServiceId'],
          type: 'foreign key',
          name: 'business_case_tow_service_fk1',
          references: {
            table: 'tow_service',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )


      .then(() =>
        queryInterface.addConstraint(BUSINESS_CASE_TOW_SERVICE, {
          fields: ['fkCreatedBy'],
          type: 'foreign key',
          name: 'business_case_fk2',
          references: {
            table: 'users',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )
      .then(() =>
        queryInterface.addConstraint(BUSINESS_CASE_TOW_SERVICE, {
          fields: ['fkUpdatedBy'],
          type: 'foreign key',
          name: 'business_case_fk3',
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
    await queryInterface.dropTable(BUSINESS_CASE_TOW_SERVICE);
  },
};
