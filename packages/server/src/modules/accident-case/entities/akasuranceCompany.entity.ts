import { Model, Column, Table, DataType, AllowNull, HasMany, HasOne, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/modules/user/entities/user.entity';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Participant } from './participant.entity';

@Table({
  tableName: 'akaInsuranceCompany',
  timestamps: true,
  paranoid: true,
})
export class AkaInsuranceCompany extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AllowNull(false)
  @Column( DataType.STRING )
  name: string;

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
  



}
