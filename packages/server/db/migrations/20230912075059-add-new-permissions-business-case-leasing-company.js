'use strict';
const dayjs = require('dayjs');

const permissionsData = {
  table: 'permissions',
  data: [
  
   
       // leasing-insurance-company-permissions
   
    {
      permission: 'leasing_insurance_company',
      name: 'Leasing Insurance Company',
      parent: 'module_permission',
      moduleName: 'subModule',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_view_leasing_insurance_company',
      name: 'View',
      parent: 'leasing_insurance_company',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_add_leasing_insurance_company',
      name: 'Add',
      parent: 'leasing_insurance_company',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_delete_leasing_insurance_company',
      name: 'Delete',
      parent: 'leasing_insurance_company',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_edit_leasing_insurance_company',
      name: 'Edit',
      parent: 'leasing_insurance_company',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },

    // busines-case-permissions

    {
    permission: 'business_case',
    name: 'Business Case',
    parent: 'module_permission',
    moduleName: 'subModule',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_view_business_case',
    name: 'View',
    parent: 'business_case',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_add_business_case',
    name: 'Add',
    parent: 'business_case',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_delete_business_case',
    name: 'Delete',
    parent: 'business_case',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_edit_business_case',
    name: 'Edit',
    parent: 'business_case',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
 


  ],
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      permissionsData.table,
      permissionsData.data,
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(permissionsData.table);
  },
};
