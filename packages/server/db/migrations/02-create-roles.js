'use strict';
const moment = require('moment-timezone');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('');
    console.log('------------------- ROLES');
    console.log('');
    const roles = [
      { name: 'SuperAdmin', createdAt: moment().toDate() },
      { name: 'CompanyAdmin', createdAt: moment().toDate() },
      { name: 'Business Manager', createdAt: moment().toDate() },
      { name: 'Regional Manager', createdAt: moment().toDate() },
      { name: 'Sale Manager', createdAt: moment().toDate() },
    ];
    await queryInterface.bulkInsert('roles', roles);
  },

  async down(queryInterface, Sequelize) {
    console.log('delete Roles');
  },
};
