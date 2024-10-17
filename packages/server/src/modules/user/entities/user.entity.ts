import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Unique,
  Default,
  AllowNull,
  DataType,
  HasOne,
  HasMany,
  DefaultScope,
  Scopes,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { LoginToken } from 'src/modules/auth/entities/login-token.entity';
// import { Company } from 'src/modules/company/entities/company.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { SuperUser } from './super-user.entity';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Region } from 'src/modules/region/entities/region.entity';
import { BusinessCaseActivity } from 'src/modules/business-case/entities/business-case-activity.entity';
import { Workshop } from 'src/modules/workshop/entities/workshop.entity';
import { TowService } from 'src/modules/tow_service/entities/tow-service.entity';
import { UserRegion } from './user-region.entity';


@DefaultScope(() => ({
  attributes: { exclude: ['password', 'salt'] },
}))
@Scopes(() => ({
  withPassword: {},
}))
@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  scopes: {
    active: { where: { isActive: true } },
  },
})

export class User extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    field: 'fkRoleId',
  })
  roleId: number;
  
  // @ForeignKey(() => Region)
  // @Column({
  //   type: DataType.UUID,
  //   field: 'fkRegionId',
  // })
  // regionId: number;


  @Unique(true)
  @Column(DataType.STRING(20))
  username: string;

  @Column(DataType.STRING(100))
  password: string;
  @Column(DataType.STRING(100))
  confirmPassword: string;

  @Column(DataType.STRING(50))
  email: string;

  @Column(DataType.STRING(20))
  phone: string;

  @Column(DataType.TEXT)
  profilePic: string;

  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Column(DataType.STRING)
  salt: string;

  @Column(DataType.DATE)
  passwordResetAt: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

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

  @HasOne(() => SuperUser, { foreignKey: 'userId', as: 'SuperUser' })
  SuperUser: SuperUser;

  @HasMany(() => LoginToken, { foreignKey: 'userId' })
  LoginToken: LoginToken;

  @HasMany(() => Workshop, { foreignKey: 'createdBy' })
  Workshop: Workshop;

  @HasMany(() => TowService, { foreignKey: 'createdBy' })
  TowService: TowService;

  
  @HasMany(() => UserRegion, { foreignKey: 'userId' })
  UserRegion: UserRegion;

  @BelongsTo(() => Role, { foreignKey: 'roleId' })
  Role: Role;
 
  // @BelongsTo(() => Region, { foreignKey: 'regionId' })
  // Region: Region;


}

