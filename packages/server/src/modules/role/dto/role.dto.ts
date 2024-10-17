export class RoleDto {
    id: number;
    permissionId:number;
    rolePermissionId:number;
    name: string;
  }
  
  export class CreateRoleDto {
    name: string;
    permissionId:number;
    rolePermissionid:number;
    
  }
  
  export class UpdateRoleDto {
    name?: string;
 
  }
  export class DeleteRoleDto {
    name?: string;
    
  }
