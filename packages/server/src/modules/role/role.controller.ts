
import { Controller, Get, Put, Delete, UseGuards, Query, Post, Body, UseInterceptors, ValidationPipe, BadRequestException, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleService } from './role.service';
import { PermissionService } from './permission.service';
import { RolePermissionService } from './role-permission.service';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { ALL, ANY, PERMISSIONS } from 'src/constants/permissions';

import { HasPermission } from '../auth/decorators/has-permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TransactionInterceptor } from 'src/database/transaction.interceptor';
import { TransactionParam } from 'src/database/transaction-param.decorator';

import { Transaction } from 'sequelize';
import { CreateRoleDto } from './dto/role.dto';
import { ValidationError } from 'class-validator';
import transaction from 'sequelize/types/transaction';

const {
  CAN_VIEW_ROLE,
  CAN_ADD_ROLE,
  CAN_EDIT_ROLE,
  CAN_DELETE_ROLE,
  CAN_EDIT_ROLE_PERMISSION,
} = PERMISSIONS;

@UseGuards(AuthGuard())
@Controller('role')
export class RoleController {
  constructor(
    private readonly service: RoleService,
    private readonly permissionService: PermissionService,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @UseInterceptors(TransactionInterceptor)
  @Post('/save')
  @HasPermission([CAN_ADD_ROLE, CAN_EDIT_ROLE], ALL)
  @UseGuards(PermissionsGuard)
  saveRole(
    @Body(
      new ValidationPipe({
        transform: true,
        exceptionFactory: (errors: ValidationError[]) =>
          new BadRequestException(errors),
      }),
    )
    body: CreateRoleDto,
    @GetLoggedInUser() loggedInUser: any,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.service.saveRole(body, loggedInUser, transaction);
  }

  @Post(':id/save-role-permission')
  @HasPermission([CAN_EDIT_ROLE_PERMISSION], ALL)
  @UseGuards(PermissionsGuard)
  saveRolePermissions(@Body() body: any, @Param('id') id: string) {
    return this.service.saveRolePermissions(body, id);
  }

  @Get('/permissions')
  getAllPermissions() {
    return this.permissionService.getAllPermissions();
  }

  @Get('/search')
  @HasPermission([CAN_VIEW_ROLE], ANY)
  @UseGuards(PermissionsGuard)
  search(@Query() query: any) {
    return this.service.search(query);
  }

  @Get(':id')
  @HasPermission([CAN_EDIT_ROLE, CAN_VIEW_ROLE], ANY)
  @UseGuards(PermissionsGuard)
  findOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  @Get(':id/permissions')
  @HasPermission([CAN_EDIT_ROLE_PERMISSION, CAN_VIEW_ROLE], ALL)
  @UseGuards(PermissionsGuard)
  getRolePermission(@Param('id') id: string, @Query() query: string) {
    return this.service.getRolePermission(id, query);
  }

  @Get()
  @HasPermission([CAN_VIEW_ROLE, CAN_EDIT_ROLE], ANY)
  @UseGuards(PermissionsGuard)
  findAll(@Query() query: any) {
    return this.service.getAll(query);
  }

  @Delete(':id')
  @HasPermission([CAN_DELETE_ROLE], ALL)
  @UseGuards(PermissionsGuard)
  remove(
    @Param('id') id: string,
    @GetLoggedInUser() loggedInUser: any,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.service.delete(id, loggedInUser, transaction);
  }
}
