import { Json } from 'aws-sdk/clients/marketplacecatalog';
import { Model, Column, Table, DataType, AllowNull, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BusinessCase } from 'src/modules/business-case/entities/business-case.entity';
import { Region } from 'src/modules/region/entities/region.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

@Table({
  tableName: 'workshop',
  timestamps: true,
  paranoid: true,
})
export class Workshop extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.UUID,
    field: 'fkRegionId',
  })
  regionId: string;

  @AllowNull(true)
  @Column( DataType.FLOAT )
  rating: string;
  
  @AllowNull(false)
  @Column( DataType.STRING )
  name: string;

  @AllowNull(true)
  @Column( DataType.STRING )
  logo: string;
  
  @AllowNull(false)
  @Column( DataType.FLOAT )
  lattitude: number;

  @AllowNull(false)
  @Column( DataType.FLOAT )
  longitude: number;

  @AllowNull(true)
  @Column(DataType.JSONB)
  workshopAttachments: Json;

  @AllowNull(false)
  @Column( DataType.STRING )
  address: string;

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

// Associations

@HasMany(() => BusinessCase, { foreignKey: 'workshopId' })
BusinessCase: BusinessCase;

@BelongsTo(() => Region, { foreignKey: 'regionId' })
  Region: Region;

  @BelongsTo(() => User, { foreignKey: 'createdBy' })
  User: User;
  
}
