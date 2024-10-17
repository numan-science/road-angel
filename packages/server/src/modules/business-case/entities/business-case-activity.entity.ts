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
import { BusinessCase } from './business-case.entity';
import { Json } from 'aws-sdk/clients/robomaker';
import { User } from 'src/modules/user/entities/user.entity';
import { Participant } from 'src/modules/accident-case/entities/participant.entity';
  
  @Table({
    tableName: 'business_case_activity',
    timestamps: true,
    paranoid: true,
  })
  export class BusinessCaseActivity extends Model {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
  
    @ForeignKey(() => BusinessCase)
    @Column({
      type: DataType.UUID,
      field: 'fkBusinessCaseId',
    })
    businessCaseId: string;

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

  
    @AllowNull(true)
    @Column( DataType.JSONB )
    actions: Json;
  
  
    @AllowNull(false)
    @Column(DataType.DATE)
    createdAt: Date;
  
    @Column(DataType.DATE)
    updatedAt: Date;
  
  
    //-- ASSOCIATIONS
  
    @BelongsTo(() =>BusinessCase, { foreignKey: 'businessCaseId' })
    BusinessCase: BusinessCase;

  //   @BelongsTo(() => Participant, {foreignKey: 'participantA', as: "ParticipantA"})
  // ParticipantA: Participant;

  // @BelongsTo(() => Participant, {foreignKey: 'participantB', as: "ParticipantB"})
  // ParticipantB: Participant



    @BelongsTo(() => User, {foreignKey: 'createdBy', as: "CreatedBy"})
    CreatedBy: User;

    @BelongsTo(() => User, {foreignKey: 'updatedBy', as: "UpdatedBy"})
    UpdatedBy: User;
  
  }