import {
  Model,
  Column,
  Table,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { AccidentCase } from './accident-case.entity ';
import { Participant } from './participant.entity';
import { text } from 'aws-sdk/clients/customerprofiles';

@Table({
  tableName: 'accident_case_documents',
  timestamps: true,
  paranoid: true,
})
export class AccidentCaseDocuments extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AllowNull(false)
  @ForeignKey(() => AccidentCase)
  @Column({
    type: DataType.UUID,
    field: 'fkAccidentCaseId',
  })
  accidentCaseId: string;

  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'fkDamageParticipantId',
  })
  damageParticipant: string;

  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'fkCulpritParticipantId',
  })
  culpritParticipant: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  culpritParticipantSign: text;

  @AllowNull(true)
  @Column(DataType.TEXT)
  damageParticipantSign: text;

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
    foreignKey: 'culpritParticipant',
    as: 'CulpritParticipant',
  })
  CulpritParticipant: Participant;
  
  @BelongsTo(() => Participant, {
    foreignKey: 'damageParticipant',
    as: 'DamageParticipant',
  })
  DamageParticipant: Participant;
}
