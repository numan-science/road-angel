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
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from './role.entity';
import { InsuranceCompany } from 'src/modules/insurance-companies/entities/insurance-companies.entity';

@Table({
  tableName: 'company_roles',
  timestamps: true,
  paranoid: true,
  scopes: {
    active: { where: { isActive: true } },
  },
})
export class CompanyRole extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ForeignKey(() => InsuranceCompany)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'fkInsuranceCompanyId',
  })
  fkInsuranceCompanyId: string;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'fkRoleId',
  })
  roleId: string;

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

 
}
