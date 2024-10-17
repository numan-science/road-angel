import { timestamp } from 'aws-sdk/clients/cloudfront';
import { truncate } from 'lodash';
import {
  Model,
  Column,
  Table,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/modules/user/entities/user.entity';
import { PrimaryGeneratedColumn } from 'typeorm';
import { text } from 'aws-sdk/clients/customerprofiles';
import { AccidentCase } from './accident-case.entity ';

@Table({
  tableName: 'accident_scenario',
  timestamps: true,
  paranoid: true,
})
export class AccidentScenario extends Model {
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
  @Column(DataType.TEXT)
  filePath: text;

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
}
