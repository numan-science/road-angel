import * as _ from 'lodash';

export const ANY = 'any';
export const ALL = 'all';

export const PERMISSIONS = {
  
  CAN_ADD_USER: 'can_add_user',
  CAN_EDIT_USER: 'can_edit_user',
  CAN_DELETE_USER: 'can_delete_user',
  CAN_ADD_WORKSHOP: 'can_add_workshop',
  CAN_EDIT_WORKSHOP: 'can_edit_workshop',
  CAN_DELETE_WORKSHOP: 'can_delete_workshop',
  CAN_VIEW_WORKSHOP: 'can_view_workshop',
  CAN_ADD_INURANCE_COMPANIES: 'can_add_insurance_companies',
  CAN_EDIT_INSURANCE_COMPANIES: 'can_edit_insurance_companies',
  CAN_DELETE_INSURANCE_COMPANIES: 'can_delete_insurance_companies',
  CAN_VIEW_INSURANCE_COMPANIES: 'can_view_insurance_companies', 
  CAN_ADD_TOW_SERVICE: 'can_add_tow_companies',
  CAN_EDIT_TOW_SERVICE: 'can_edit_tow_service',
  CAN_DELETE_TOW_SERVICE: 'can_delete_tow_service',
  CAN_VIEW_TOW_SERVICE: 'can_view_tow_service',
  CAN_VIEW_ROLE: 'can_view_role',
  CAN_ADD_ROLE: 'can_add_role',
  CAN_EDIT_ROLE: 'can_edit_role',
  CAN_DELETE_ROLE: 'can_delete_role',
  CAN_VIEW_REGION: 'can_view_region',
  CAN_ADD_REGION: 'can_add_region',
  CAN_EDIT_REGION: 'can_edit_region',
  CAN_DELETE_REGIONE: 'can_delete_region',
  CAN_EDIT_ROLE_PERMISSION: 'can_edit_role_permission',
  
  
};





export const DEFAULT_BM_PERMISSIONS = _.uniq([

  PERMISSIONS.CAN_VIEW_ROLE,
  PERMISSIONS.CAN_ADD_ROLE,
  PERMISSIONS.CAN_EDIT_ROLE,
  PERMISSIONS.CAN_DELETE_ROLE,
  PERMISSIONS.CAN_VIEW_WORKSHOP,
  PERMISSIONS.CAN_ADD_WORKSHOP,
  PERMISSIONS.CAN_EDIT_WORKSHOP,
  PERMISSIONS.CAN_DELETE_WORKSHOP,
  PERMISSIONS.CAN_VIEW_INSURANCE_COMPANIES,
  PERMISSIONS.CAN_ADD_INURANCE_COMPANIES,
  PERMISSIONS.CAN_EDIT_INSURANCE_COMPANIES,
  PERMISSIONS.CAN_DELETE_INSURANCE_COMPANIES,
  PERMISSIONS.CAN_VIEW_TOW_SERVICE,
  PERMISSIONS.CAN_ADD_TOW_SERVICE,
  PERMISSIONS.CAN_EDIT_TOW_SERVICE,
  PERMISSIONS.CAN_DELETE_TOW_SERVICE,

  ]);
  
 


export const DEFAULT_SM_PERMISSIONS = _.uniq([
    ...DEFAULT_BM_PERMISSIONS,

  PERMISSIONS.CAN_VIEW_ROLE,
  PERMISSIONS.CAN_ADD_ROLE,
  PERMISSIONS.CAN_EDIT_ROLE,
  PERMISSIONS.CAN_DELETE_ROLE,
  PERMISSIONS.CAN_VIEW_INSURANCE_COMPANIES,
  PERMISSIONS.CAN_ADD_INURANCE_COMPANIES,
  PERMISSIONS.CAN_EDIT_INSURANCE_COMPANIES,
  PERMISSIONS.CAN_DELETE_INSURANCE_COMPANIES,
  

]);
