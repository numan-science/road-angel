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
  
  @Table({
    tableName: 'business_case_documents',
    timestamps: true,
    paranoid: true,
  })
  export class BusinessCaseDocuments extends Model {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @AllowNull(false)
    @ForeignKey(() => BusinessCase)
    @Column({
      type: DataType.UUID,
      field: 'fkBusinessCaseId',
    })
    businessCaseId: string;


    @AllowNull(false)
    @Column( DataType.STRING )
    status: string;


    @AllowNull(false)
    @Column( DataType.STRING )
    fileName: string;


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
  
  }