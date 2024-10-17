import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    DataType,
    ForeignKey,
    Default,
    HasOne,
  } from 'sequelize-typescript';
  import { SuperUser } from '../../../modules/user/entities/super-user.entity';
  import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { User } from './user.entity';
  
  @Table({
    tableName: 'settings',
  })
  export class Settings extends Model {
    @PrimaryGeneratedColumn('uuid')
    id: string;



    @AllowNull(false)
  @Column(DataType.STRING)
  websitename: string;


  @AllowNull(false)
  @Column(DataType.STRING)
  logo: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  contact: string;

    @ForeignKey(() =>User)
    @AllowNull(false)
    @Column({
      type: DataType.UUID,
      field: 'fkUserId',
    })
    UserId: number;
  
    @AllowNull(false)
    @Default(true)
    @Column(DataType.BOOLEAN)
    isActive: boolean;
    
    @AllowNull(false)
    @Column(DataType.DATE)
    createdAt: Date;
    
    @Column(DataType.DATE)
    updatedAt: Date;



// -- Associations

@HasOne(() => User, { foreignKey: 'userId', as: 'User' })
User:User;
  }




