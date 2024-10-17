import {
  Model,
  Column,
  Table,
  DataType,
  AllowNull,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { PrimaryGeneratedColumn } from 'typeorm';
import { InsuranceDocuments } from '../../insurance-documents/entities/insurance-documents.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { InsuranceCompanyUser } from 'src/modules/insurance-companies-user/entities/insurance-companies-user.entity';
import { BusinessCase } from 'src/modules/business-case/entities/business-case.entity';

@Table({
  tableName: 'insurance_companies',
  timestamps: true,
  paranoid: true,
})
export class InsuranceCompany extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  logo: string;

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

  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

  //-- ASSOCIATIONS

  @HasMany(() => InsuranceDocuments, { foreignKey: 'insuranceCompanyId' })
  InsuranceDocuemts: InsuranceDocuments;

  @HasMany(() => BusinessCase, { foreignKey: 'insuranceCompanyId' })
  BusinessCase: BusinessCase;

  @HasMany(() => InsuranceCompanyUser, { foreignKey: 'insuranceCompanyId' })
  InsuranceCompanyUser: InsuranceCompanyUser;
}
