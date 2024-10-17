import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { User } from '../../../modules/user/entities/user.entity';
import { Settings } from './settings.entity';

@Table({
  tableName: 'super_user',
})
export class SuperUser extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'fkUserId',
  })
  userId: number;

  @ForeignKey(() =>Settings)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'fkSettingsId',
  })
  settingsId: number;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;
  
  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date;
  
  @Column(DataType.DATE)
  updatedAt: Date;


// Associations
  @BelongsTo(() => User, { foreignKey: 'userId' })
  User: User; 
}
