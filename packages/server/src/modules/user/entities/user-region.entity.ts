import {
  Table,
  Column,
  Model,
  AllowNull,
  DataType,
  DefaultScope,
  Scopes,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Region } from 'src/modules/region/entities/region.entity';
import { User } from './user.entity';


@DefaultScope(() => ({
  attributes: { exclude: ['password', 'salt'] },
}))
@Scopes(() => ({
  withPassword: {},
}))
@Table({
  tableName: 'user_regions',
  timestamps: true,
  paranoid: true,
  scopes: {
    active: { where: { isActive: true } },
  },
})

export class UserRegion extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'fkUserId',
  })
  userId: string;
  
  @AllowNull(false)
  @ForeignKey(() => Region)
  @Column({
    type: DataType.UUID,
    field: 'fkRegionId',
  })
  regionId: string;


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

  @Column(DataType.DATE)
  deletedAt: Date;

  //-- ASSOCIATIONS


 
  @BelongsTo(() => Region, { foreignKey: 'regionId' })
  Region: Region;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  User: User;

}

