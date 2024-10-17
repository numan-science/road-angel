// 
import { Model, Column, Table, DataType, AllowNull, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/modules/user/entities/user.entity';
import { AccidentScenario } from './accident-scnario.entity';
import { text, uuid } from 'aws-sdk/clients/customerprofiles';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { AccidentCase } from './accident-case.entity ';
import { Json } from 'aws-sdk/clients/robomaker';
import { LeasingInsuranceCompany } from 'src/modules/leasing-insurance-companies/entities/leasing-insurance-companies.entity';
import { BusinessCase } from 'src/modules/business-case/entities/business-case.entity';
import { InsuranceCompany } from 'src/modules/insurance-companies/entities/insurance-companies.entity';


@Table({
  tableName: 'participant',
  timestamps: true,
  paranoid: true,
})
export class Participant extends Model {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AllowNull(false)
  @ForeignKey(() => AccidentCase)
  @Column({
    type: DataType.UUID,
    field: 'fkAccidentCaseId',
  })
  accidentCaseId: string;

  @AllowNull(true)
  @ForeignKey(() => LeasingInsuranceCompany)
  @Column({
    type: DataType.UUID,
    field: 'fkLeasingInsuranceCompanyId',
  })
  leasingInsuranceCompanyId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  driverAddress: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  label: string;

 

  @AllowNull(false)
  @Column(DataType.JSONB)
  driverAttachments: Json;

  @AllowNull(false)
  @Column(DataType.STRING)
  driverName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  driverSurname: string;


  @AllowNull(true)
  @Column( DataType.STRING )
  carOwnBy: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  ownerBirthNumber: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  companyRegistrationNumber: string;
  
  @AllowNull(true)
  @Column(DataType.STRING)
  companyName: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  companyEmail: string;


  @AllowNull(false)
  @Column(DataType.STRING)
  ownerTelephone: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  partyEmail: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  vehicleLicensePlate: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  vehicleModel: string;
  
  @AllowNull(false)
  @Column(DataType.STRING)
  vinNumber: string;


  @AllowNull(false)
  @Column(DataType.STRING)
  yearOfManufacture: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  selectMultipleOptionsToExplainScenario: Json;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  companyVatPayer: boolean;

  @AllowNull(true)
  @Column(DataType.STRING)
  vatNumber: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  liabilityInsurance: boolean;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isDamageInsurance: boolean;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  forLeasing: boolean;

  @AllowNull(false)
  @Column(DataType.STRING)
  vehicleTypeMark: string;


  @AllowNull(false)
  @Column(DataType.NUMBER)
  vehicleRegistrationNumber: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  driverLicenseNumber: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  ownerPhoneNumber: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  thirdPartyAddress: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  ownerAddress: string;


  @AllowNull(true)
  @Column(DataType.STRING)
  ownerName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  thirdPartyGreenCard: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  thirdPartyPolicyNumber: string;


  @AllowNull(false)
  @Column(DataType.STRING)
  remarks: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  accidentCausedByDriverA: boolean;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  accidentCausedByCommonFault: boolean;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  accidentCausedByDriverB: boolean;

  @AllowNull(false)
  @Column(DataType.TEXT)
  signature: text;

  @AllowNull(false)
  @Column(DataType.TEXT)
  initialImpact: text;

  @AllowNull(false)
  @Column(DataType.DATE)
  greenCardValidUntil: Date;

  @AllowNull(false)
  @Column(DataType.STRING)
  driverGroups: string;

  @AllowNull(true)
  @Column(DataType.STRING) 
  otherAkaInsuranceCompanyName: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  otherDamageInsuranceCompanyName: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  otherLiabilityInsuranceCompanyName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  driverIssuedBy: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  driverValidFrom: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  driverValidTo: Date;

  @AllowNull(true)
  @Column(DataType.STRING)
  accidentCausedByOtherAddress: string;


  @AllowNull(false)
  @Column(DataType.JSON)
  visibleDamage: Json;

  @AllowNull(true)
  @Column(DataType.STRING)
  accidentCausedByOtherName: string;

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


// Associations


@BelongsTo(() => AccidentCase, { foreignKey: 'accidentCaseId' })
AccidentCase: AccidentCase;


@BelongsTo(() => LeasingInsuranceCompany, { foreignKey: 'leasingInsuranceCompanyId' })
LeasingInsuranceCompany: LeasingInsuranceCompany;

@BelongsTo(() => InsuranceCompany, {foreignKey: 'liabilityInsuranceCompanyId', as: "LiabilityInsuranceCompany"})
LiabilityInsuranceCompany: InsuranceCompany;


@BelongsTo(() => InsuranceCompany, {foreignKey: 'damageInsuranceCompanyId', as: "DamageInsuranceCompany"})
DamageInsuranceCompany: InsuranceCompany;


}







