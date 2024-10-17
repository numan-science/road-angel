import { Model, Column, Table, DataType, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BusinessCase } from 'src/modules/business-case/entities/business-case.entity';
import { Region } from 'src/modules/region/entities/region.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

@Table({
  tableName: 'tow_service',
  timestamps: true,
  paranoid: true,
})
export class TowService extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.UUID,
    field: 'fkRegionId',
  })
  regionId: string;

  @AllowNull(false)
  @Column( DataType.STRING )
  name: string;
  
  @AllowNull(true)
  @Column( DataType.FLOAT )
  rating: string;

  @AllowNull(true)
  @Column( DataType.STRING )
  logo: string;

  
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
  @Column(DataType.STRING)
  address: String

  @AllowNull(false)
  @Column(DataType.STRING)
  phone: String

  @AllowNull(false)
  @Column(DataType.STRING)
  email: String


  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date;
  
  @Column(DataType.DATE)
  updatedAt: Date;


  // Associations

  @HasMany(() => BusinessCase, { foreignKey: 'towServiceId' })
  BusinessCase: BusinessCase;
  
  @BelongsTo(() => Region, { foreignKey: 'regionId' })
  Region: Region;

  @BelongsTo(() => User, { foreignKey: 'createdBy' })
  User: User;
  

}
