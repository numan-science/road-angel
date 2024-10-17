import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../../../modules/user/entities/user.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

@Table({
  tableName: 'forgot_passwords',
  timestamps: true,
  scopes: {
    active: { where: { isActive: true } },
  },
})
export class ForgotPassword extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: 'fkUserId',
  })
  userId: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  token: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  expiredAt: Date;

  @Column(DataType.DATE)
  servedAt: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;
}
