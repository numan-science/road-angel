import { timestamp } from 'aws-sdk/clients/cloudfront';
import { truncate } from 'lodash';
import { User } from 'src/modules/user/entities/user.entity';
import { Participant } from './participant.entity';
import { AccidentScenario } from './accident-scnario.entity';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { BusinessCase } from 'src/modules/business-case/entities/business-case.entity';
@Table({
  tableName: 'accident_case',
  timestamps: true,
  paranoid: true,
})
export class AccidentCase extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @AllowNull(false)
  @Column( DataType.DATE )
  dateOfAccident: Date;



  @AllowNull(false)
  @Column( DataType.BOOLEAN )
  injuries: boolean;

  @AllowNull(false)
  @Column( DataType.STRING )
  country: string;

  
  @AllowNull(false)
  @Column( DataType.STRING )
  city: string;
  
  @AllowNull(true)
  @Column(DataType.STRING)
  policeDepartment: string;

  @AllowNull(false)
  @Column( DataType.BOOLEAN )
  otherCarDamage: boolean;
  
  @AllowNull(true)
  @Column( DataType.STRING )
  witness: string;

  @AllowNull(false)
  @Column( DataType.STRING )
  accidentAddress: string;

  @AllowNull(false)
  @Column( DataType.BOOLEAN )
  investigationByPolice: boolean;
  
  @Column({
    type: DataType.STRING,
    field: 'status',
  })
  status: string;

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


@HasMany(() => Participant, { foreignKey: 'accidentCaseId' })
Participant: Participant;


@HasMany(() => AccidentScenario, { foreignKey: 'accidentCaseId' })
AccidentScenario: AccidentScenario;


@HasMany(() => BusinessCase, { foreignKey: 'accidentCaseId' })
BusinessCase: BusinessCase;


@BelongsTo (() => User, {foreignKey:'createdBy'})
User: User
 
}

