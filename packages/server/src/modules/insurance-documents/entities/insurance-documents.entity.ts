import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { InsuranceCompany } from '../../insurance-companies/entities/insurance-companies.entity';
import { PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Table({
  tableName: 'insurance_documents',
  timestamps: true,
  paranoid: true,
  scopes: {
    active: { where: { isActive: true } },
  },
})
export class InsuranceDocuments extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  fileName: string;

  

  @AllowNull(false)
  @ForeignKey(() => InsuranceCompany)
  @Column({
    type: DataType.UUID,
    field: 'fkinsurance_companyId',
    
  })
  insuranceCompanyId: string;


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

  @BelongsTo(() => InsuranceCompany, { foreignKey: 'insuranceCompanyId' })
  InsuranceCompany: InsuranceCompany;
 

  
}
