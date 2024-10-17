import { Model, Column, Table, DataType, AllowNull, ForeignKey} from 'sequelize-typescript';
import { PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';


@Table({
  tableName: 'leasing_insurance_company',
  timestamps: true,
  paranoid: true,
})
export class LeasingInsuranceCompany extends Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AllowNull(false)
  @Column( DataType.STRING )
  name: string;

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
  @Column(DataType.DATE)
  createdAt: Date;
  
  @Column(DataType.DATE)
  updatedAt: Date;

}



