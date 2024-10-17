'use strict';
const dayjs = require('dayjs');

const permissionsData = {
  table: 'permissions',
  data: [
    // ----- MODULES
    {
      permission: 'module_permission',
      name: 'All Modules',
      parent: 'mainModule',
      moduleName: 'parent',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    // ----- MODULES - PROJECT
   

    //-- Insurance COMPANY Permissions
    {
      permission: 'company_permission',
      name: 'Company',
      parent: 'mainModule',
      moduleName: 'parent',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    // ----- COMPANY - USERS
    {
      permission: 'user_permission',
      name: 'User',
      parent: 'company_permission',
      moduleName: 'subModule',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    // ----- COMPANY - USERS - PERMISSIONS
    {
      permission: 'can_view_user',
      name: 'View',
      parent: 'user_permission',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_add_user',
      name: 'Add',
      parent: 'user_permission',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_edit_user',
      name: 'Edit',
      parent: 'user_permission',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_delete_user',
      name: 'Delete',
      parent: 'user_permission',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },

    // // ----- COMPANY - CLIENTS
    // {
    //   permission: 'client_permission',
    //   name: 'Client',
    //   parent: 'company_permission',
    //   moduleName: 'subModule',
    //   isActive: true,
    //   createdAt: dayjs().toDate(),
    // },
    // // ----- COMPANY - CLIENTS - PERMISSIONS
    // {
    //   permission: 'can_view_client',
    //   name: 'View',
    //   parent: 'client_permission',
    //   moduleName: 'isChild',
    //   isActive: true,
    //   createdAt: dayjs().toDate(),
    // },
    // {
    //   permission: 'can_add_client',
    //   name: 'Add',
    //   parent: 'client_permission',
    //   moduleName: 'isChild',
    //   isActive: true,
    //   createdAt: dayjs().toDate(),
    // },
    // {
    //   permission: 'can_edit_client',
    //   name: 'Edit',
    //   parent: 'client_permission',
    //   moduleName: 'isChild',
    //   isActive: true,
    //   createdAt: dayjs().toDate(),
    // },
    // {
    //   permission: 'can_delete_client',
    //   name: 'Delete',
    //   parent: 'client_permission',
    //   moduleName: 'isChild',
    //   isActive: true,
    //   createdAt: dayjs().toDate(),
    // },

    // ----- COMPANY - ROLES
    {
      permission: 'role_permission',
      name: 'Role',
      parent: 'company_permission',
      moduleName: 'subModule',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    // -----  ROLES - PERMISSIONS
    {
      permission: 'can_view_role',
      name: 'View',
      parent: 'role_permission',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_add_role',
      name: 'Add',
      parent: 'role_permission',
       moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_edit_role',
      name: 'Edit',
      parent: 'role_permission',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_delete_role',
      name: 'Delete',
      parent: 'role_permission',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_edit_role_permission',
      name: 'Edit ',
      parent: 'role_permission',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },

    {
      permission: 'submit case',
      name: 'Submit Case',
      parent: 'module_permission',
      moduleName: 'subModule',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_view_submit_case',
      name: 'View',
      parent: 'submit case',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_add_submit_case',
      name: 'Add',
      parent: 'submit case',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_delete_submit_case',
      name: 'Delete',
      parent: 'submit case',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },

    {
      permission: 'can_edit_submit_case',
      name: 'Edit',
      parent: 'submit case',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },


  

    {
      permission: 'cases list',
      name: 'Cases List',
      parent: 'module_permission',
      moduleName: 'subModule',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_view_cases_list',
      name: 'View',
      parent: 'cases list',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_add_cases_list',
      name: 'Add',
      parent: 'cases list',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_delete_cases_list',
      name: 'Delete',
      parent: 'cases list',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_edit_cases_list',
      name: 'Edit',
      parent: 'cases list',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    



    {
      permission: 'workshop',
      name: 'Workshop',
      parent: 'module_permission',
      moduleName: 'subModule',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_view_workshop',
      name: 'View',
      parent: 'workshop',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_add_workshop',
      name: 'Add',
      parent: 'workshop',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_delete_workshop',
      name: 'Delete',
      parent: 'workshop',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_edit_workshop',
      name: 'Edit',
      parent: 'workshop',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
   
    {
      permission: 'region',
      name: 'Region',
      parent: 'module_permission',
      moduleName: 'subModule',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_view_region',
      name: 'View',
      parent: 'region',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_add_region',
      name: 'Add',
      parent: 'region',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_delete_region',
      name: 'Delete',
      parent: 'region',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_edit_region',
      name: 'Edit',
      parent: 'region',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'insurance_company',
      name: 'Insurance Company',
      parent: 'module_permission',
      moduleName: 'subModule',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_view_insurance_company',
      name: 'View',
      parent: 'insurance_company',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_add_insurance_company',
      name: 'Add',
      parent: 'insurance_company',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_delete_insurance_company',
      name: 'Delete',
      parent: 'insurance_company',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },
    {
      permission: 'can_edit_insurance_company',
      name: 'Edit',
      parent: 'insurance_company',
      moduleName: 'isChild',
      isActive: true,
      createdAt: dayjs().toDate(),
    },

    
    {
    permission: 'tow_service',
    name: 'Tow Service',
    parent: 'module_permission',
    moduleName: 'subModule',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_view_tow_service',
    name: 'View',
    parent: 'tow_service',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_add_tow_service',
    name: 'Add',
    parent: 'tow_service',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_delete_tow_service',
    name: 'Delete',
    parent: 'tow_service',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_edit_tow_service',
    name: 'Edit',
    parent: 'tow_service',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'business_agents',
    name: 'Business Agents',
    parent: 'module_permission',
    moduleName: 'subModule',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_view_business_agents',
    name: 'View',
    parent: 'business_agents',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_add_business_agents',
    name: 'Add',
    parent: 'business_agents',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_delete_business_agents',
    name: 'Delete',
    parent: 'business_agents',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_edit_business_agents',
    name: 'Edit',
    parent: 'business_agents',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  
  
   


  {
    permission: 'sale_agents',
    name: 'Sale Agents',
    parent: 'module_permission',
    moduleName: 'subModule',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_view_sale_agents',
    name: 'View',
    parent: 'sale_agents',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_add_sale_agents',
    name: 'Add',
    parent: 'sale_agents',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_delete_sale_agents',
    name: 'Delete',
    parent: 'sale_agents',
    moduleName: 'isChild',
    isActive: true,
    createdAt: dayjs().toDate(),
  },
  {
    permission: 'can_edit_sale_agents',
    name: 'Edit',
    parent: 'sale_agents',
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
