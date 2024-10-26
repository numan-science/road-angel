
import {
    Model,
    Column,
    Table,
    DataType,
    AllowNull
} from 'sequelize-typescript';
import { PrimaryGeneratedColumn } from 'typeorm';
  
  @Table({
    tableName: 'resource_sharing',
    timestamps: true,
    paranoid: true,
  })
  export class ResourceSharing extends Model {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    
      @AllowNull(false)
      @Column(DataType.STRING)
      name: string;
    
      @AllowNull(false)
      @Column(DataType.STRING)
      description: string;

      @AllowNull(true)
      @Column(DataType.STRING)
      imgUrl: string;

      @AllowNull(true)
      @Column(DataType.STRING)
      link: string;

      @AllowNull(false)
      @Column(DataType.STRING)
      file: string;
  
    @Column(DataType.DATE)
    createdAt: Date;
  
    @AllowNull(false)
    @Column(DataType.DATE)
    deletedAt: Date;
  
    @Column(DataType.DATE)
    updatedAt: Date;
  
    // Associations
  
  }
  
