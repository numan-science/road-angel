import {
  Model,
  Column,
  Table,
  DataType,
  AllowNull,
  HasMany,
  HasOne,
  ForeignKey,
} from 'sequelize-typescript';
import { BusinessCase } from 'src/modules/business-case/entities/business-case.entity';
import { UserRegion } from 'src/modules/user/entities/user-region.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Workshop } from 'src/modules/workshop/entities/workshop.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

@Table({
  tableName: 'region',
  timestamps: true,
  paranoid: true,
})
export class Region extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
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

  // Associations

  @HasMany(() => UserRegion, { foreignKey: 'regionId' })
  UserRegion: UserRegion;
}
