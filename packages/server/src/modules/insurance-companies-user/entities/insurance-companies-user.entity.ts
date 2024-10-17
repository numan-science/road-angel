import {
  Table,
  Column,
  Model,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { InsuranceCompany } from 'src/modules/insurance-companies/entities/insurance-companies.entity';

@Table({
  tableName: 'insurance_companies_users',
  timestamps: true,
  paranoid: true,
  scopes: {
    active: { where: { isActive: true } },
  },
})
export class InsuranceCompanyUser extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'fkUserId',
  })
  userId: string;

  @ForeignKey(() => InsuranceCompany)
  @Column({
    type: DataType.UUID,
    field: 'fkinsurance_companyId',
  })
  insuranceCompanyId: string;

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

  @BelongsTo(() => InsuranceCompany, { foreignKey: 'insurance_companyId' })
  InsuranceCompany: InsuranceCompany;
  static id: any;
  static userId: any;


}
