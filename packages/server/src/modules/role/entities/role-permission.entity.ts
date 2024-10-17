import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

@Table({
  tableName: 'role_permissions',
  timestamps: true,
  paranoid: true,
  scopes: {
    active: { where: { isActive: true } },
  },
})
export class RolePermission extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'fkRoleId',
  })
  roleId: number;

  @ForeignKey(() => Permission)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'fkPermissionId',
  })
  permissionId: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'fkCreatedBy',
  })
  createdBy: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'fkUpdatedBy',
  })
  updatedBy: number;

  @Column(DataType.DATE)
  deletedAt: Date;
  
  //-- ASSOCIATIONS

  @BelongsTo(() => Role, { foreignKey: 'roleId' })
  Role: Role;

  @BelongsTo(() => Permission, { foreignKey: 'permissionId' })
  Permission: Permission;
}

