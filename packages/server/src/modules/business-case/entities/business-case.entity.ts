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
import { AccidentCase } from 'src/modules/accident-case/entities/accident-case.entity ';
import { Participant } from 'src/modules/accident-case/entities/participant.entity';
import { InsuranceCompany } from 'src/modules/insurance-companies/entities/insurance-companies.entity';
import { TowService } from 'src/modules/tow_service/entities/tow-service.entity';
import { Workshop } from 'src/modules/workshop/entities/workshop.entity';
import { Json } from 'aws-sdk/clients/robomaker';
import { BusinessCaseActivity } from './business-case-activity.entity';
import { text } from 'aws-sdk/clients/customerprofiles';
import { User } from 'src/modules/user/entities/user.entity';
import { Region } from 'src/modules/region/entities/region.entity';

@Table({
  tableName: 'business_case',
  timestamps: true,
  paranoid: true,
})
export class BusinessCase extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  casenumber: string;

  @ForeignKey(() => AccidentCase)
  @Column({
    type: DataType.UUID,
    field: 'fkAccidentCaseId',
  })
  accidentCaseId: string;

  @AllowNull(true)
  @ForeignKey(() => InsuranceCompany)
  @Column({
    type: DataType.UUID,
    field: 'fkInsuranceCompanyId',
  })
  insuranceCompanyId: string;

  @ForeignKey(() => TowService)
  @Column({
    type: DataType.UUID,
    field: 'fkTowServiceId',
  })
  towServiceId: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.UUID,
    field: 'fkRegionId',
  })
  regionId: string;

  @ForeignKey(() => Workshop)
  @Column({
    type: DataType.UUID,
    field: 'fkWorkshopId',
  })
  workshopId: string;

  @Column({
    type: DataType.STRING,
    field: 'status',
  })
  status: string;

  @AllowNull(true)
  @Column(DataType.UUID)
  participantA: string;

  @AllowNull(true)
  @Column(DataType.UUID)
  customerParticipant: string;

  @AllowNull(true)
  @Column(DataType.UUID)
  damageParticipant: string;

  @AllowNull(true)
  @Column(DataType.UUID)
  culpritParticipant: string;

  // @AllowNull(true)
  // @Column(DataType.UUID)
  // participantB: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  participantAsignature: text;

  @AllowNull(true)
  @Column(DataType.TEXT)
  participantBsignature: text;

  @AllowNull(true)
  @Column(DataType.JSONB)
  workshopInvoiceAttachment: Json;

  @AllowNull(true)
  @Column(DataType.JSONB)
  towServiceInvoiceAttachment: Json;

  @AllowNull(true)
  @Column(DataType.STRING)
  insuranceCaseId: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  type: string;

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

  @BelongsTo(() => AccidentCase, { foreignKey: 'accidentCaseId' })
  AccidentCase: AccidentCase;

  @BelongsTo(() => Participant, {
    foreignKey: 'participantA',
    as: 'ParticipantA',
  })
  ParticipantA: Participant;

  @BelongsTo(() => Participant, {
    foreignKey: 'customerParticipant',
    as: 'CustomerParticipant',
  })
  CustomerParticipant: Participant;

  @BelongsTo(() => Participant, {
    foreignKey: 'damageParticipant',
    as: 'DamageParticipant',
  })
  DamageParticipant: Participant;

  @BelongsTo(() => Participant, {
    foreignKey: 'culpritParticipant',
    as: 'CulpritParticipant',
  })
  CulpritParticipant: Participant;

  @HasMany(() => BusinessCaseActivity, { foreignKey: 'businessCaseId' })
  BusinessCaseActivity: BusinessCaseActivity;

  // @BelongsTo(() => Participant, {
  //   foreignKey: 'participantB',
  //   as: 'ParticipantB',
  // })
  // ParticipantB: Participant;

  @BelongsTo(() => InsuranceCompany, { foreignKey: 'insuranceCompanyId' })
  InsuranceCompany: InsuranceCompany;

  @BelongsTo(() => Workshop, { foreignKey: 'workshopId' })
  Workshop: Workshop;

  @BelongsTo(() => TowService, { foreignKey: 'towServiceId' })
  TowService: TowService;

  @BelongsTo(() => Region, { foreignKey: 'regionId' })
  Region: Region;

  @BelongsTo(() => User, { foreignKey: 'createdBy' })
  User: User;
}
