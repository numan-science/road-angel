import {
  Table,
  Column,
  Model,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Table({
  tableName: 'user_permissions',
  timestamps: true,
  paranoid: true,
  scopes: {
    active: { where: { isActive: true } },
  },
})
export class UserPermission extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'fkUserId',
  })
  userId: string;

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
  createdBy: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'fkUpdatedBy',
  })
  updatedBy: string;

  @Column(DataType.DATE)
  deletedAt: Date;

  //-- ASSOCIATIONS

  @BelongsTo(() => User, { foreignKey: 'userId' })
  User: User;

  @BelongsTo(() => Permission, { foreignKey: 'permissionId' })
  Permission: Permission;
}
