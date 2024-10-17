import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PermissionService } from './permission.service';
import { RolePermissionService } from './role-permission.service';
import { roleProvider } from './role.provider';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RoleController],
  providers: [
    RoleService,
    ...roleProvider,
    PermissionService,
    RolePermissionService,
  ],
  exports: [...roleProvider, RoleService],
})
export class RoleModule {}
