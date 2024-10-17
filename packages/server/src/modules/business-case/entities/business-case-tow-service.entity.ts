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
import { TowService } from 'src/modules/tow_service/entities/tow-service.entity';
  
  @Table({
    tableName: 'business_case_tow_service',
    timestamps: true,
    paranoid: true,
  })
  export class BusinessCaseTowService extends Model {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
   
    @ForeignKey(() => BusinessCase)
    @Column({
      type: DataType.UUID,
      field: 'fkBusinessCaseId',
    })
    businessCaseId: string;

    @ForeignKey(() => TowService)
    @Column({
      type: DataType.UUID,
      field: 'fkTowServiceId',
    })
    towServiceId: string;


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
  
    @BelongsTo(() =>BusinessCase, { foreignKey: 'businessCaseId' })
    BusinessCase: BusinessCase;

    @BelongsTo(() =>TowService, { foreignKey: 'towServiceId' })
    TowService: TowService;

    @BelongsTo(() => User, {foreignKey: 'createdBy', as: "CreatedBy"})
    CreatedBy: User;

    @BelongsTo(() => User, {foreignKey: 'updatedBy', as: "UpdatedBy"})
    UpdatedBy: User;
  
  }