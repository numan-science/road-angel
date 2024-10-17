'use strict';
const USER_REGIONS = 'user_regions';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable(USER_REGIONS, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
          allowNull: false,
        },
        fkUserId: {
          type: Sequelize.UUID,
          allowNull: false,
        },

        fkRegionId: {
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
        queryInterface.addConstraint(USER_REGIONS, {
          fields: ['fkUserId'],
          type: 'foreign key',
          name: 'user_regions_fk0',
          references: {
            table: 'users',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )
      .then(() =>
        queryInterface.addConstraint(USER_REGIONS, {
          fields: ['fkRegionId'],
          type: 'foreign key',
          name: 'user_regions_fk1',
          references: {
            table: 'region',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )
      .then(() =>
        queryInterface.addConstraint(USER_REGIONS, {
          fields: ['fkCreatedBy'],
          type: 'foreign key',
          name: 'user_regions_fk2',
          references: {
            table: 'users',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )
      .then(() =>
        queryInterface.addConstraint(USER_REGIONS, {
          fields: ['fkUpdatedBy'],
          type: 'foreign key',
          name: 'user_regions_fk3',
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
    await queryInterface.dropTable(USER_REGIONS);
  },
};
