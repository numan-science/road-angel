'use strict';
const BUSINESS_CASE = 'business_case';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable(BUSINESS_CASE, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
          allowNull: false,
        },
        fkAccidentCaseId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
       
        
        fkInsuranceCompanyId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        fkWorkshopId: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        fkTowServiceId: {
          type: Sequelize.UUID,
          allowNull: true,
        },

        insuranceCaseId: {
          type: Sequelize.STRING,
          allowNull: true,
        },
          
        participantA: {
          type: Sequelize.UUID,
          allowNull: true,
        },
      
        participantB: {
          type: Sequelize.UUID,
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
        queryInterface.addConstraint(BUSINESS_CASE, {
          fields: ['fkAccidentCaseId'],
          type: 'foreign key',
          name: 'business_case_fk0',
          references: {
            table: 'accident_case',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )


      .then(() =>
        queryInterface.addConstraint(BUSINESS_CASE, {
          fields: ['fkInsuranceCompanyId'],
          type: 'foreign key',
          name: 'business_case_fk1',
          references: {
            table: 'insurance_companies',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )

      .then(() =>
        queryInterface.addConstraint(BUSINESS_CASE, {
          fields: ['fkWorkshopId'],
          type: 'foreign key',
          name: 'business_case_fk2',
          references: {
            table: 'workshop',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )
      .then(() =>
        queryInterface.addConstraint(BUSINESS_CASE, {
          fields: ['fkTowServiceId'],
          type: 'foreign key',
          name: 'business_case_fk3',
          references: {
            table: 'tow_service',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )
   


      .then(() =>
        queryInterface.addConstraint(BUSINESS_CASE, {
          fields: ['fkCreatedBy'],
          type: 'foreign key',
          name: 'business_case_fk4',
          references: {
            table: 'users',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )
      .then(() =>
        queryInterface.addConstraint(BUSINESS_CASE, {
          fields: ['fkUpdatedBy'],
          type: 'foreign key',
          name: 'business_case_fk5',
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
    await queryInterface.dropTable(BUSINESS_CASE);
  },
};