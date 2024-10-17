import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { User } from '../../../modules/user/entities/user.entity';
import { RolePermission } from './role-permission.entity';
import { PrimaryGeneratedColumn } from 'typeorm';
import { CompanyRole } from './company-roles.entity';

// import { LeasingInsuranceCompany } from 'src/modules/leasing-insurance-companies/entities/leasing-insurance-companies.entity';

@Table({
  tableName: 'roles',
  timestamps: true,
  paranoid: true,
  scopes: {
    active: { where: { isActive: true } },
  }, 
})
export class Role extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

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

  @HasMany(() => RolePermission, { foreignKey: 'roleId' })
  RolePermission: RolePermission;

  @HasMany(() => User, { foreignKey: 'roleId' })
  User: User;
  
  @HasOne(() => CompanyRole, { foreignKey: 'roleId' })
  CompanyRole: CompanyRole;

}

