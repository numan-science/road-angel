const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('');
    console.log('------------------- SUPER ADMIN');
    console.log('');
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('temp', salt);

    const roles = await queryInterface.sequelize.query(
      `SELECT roles.id from roles`,
      { type: QueryTypes.SELECT },
    );

    const data = [
      {
        email: 'admin@roadangel.com',
        password,
        createdAt: dayjs().toDate(),
        salt,
        fkRoleId: _.first(roles).id,
      },
    ];

    const saveUser = await queryInterface.bulkInsert('users', data, {
      returning: true,
    });

    const superUserData = [
      { fkUserId: _.first(saveUser).id, createdAt: dayjs().toDate() },
    ];

    await queryInterface.bulkInsert('super_user', superUserData);
  },

  down: async (queryInterface, Sequelize) => {
    console.log('delete user');
  },
};
