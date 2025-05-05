import {
    Column,
    Model,
    Table,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import { User } from '../../user/models/user.model';
  
  @Table({
    tableName: 'shops',
    timestamps: true,
  })
  export class Shop extends Model {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    })
    username: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    password: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    storeName: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    ownerName: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    })
    gstinNumber: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    })
    phoneNumber: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    zone: string;
  
    @Column({
      type: DataType.ARRAY(DataType.STRING),
      allowNull: false,
    })
    servicesOffered: string[];
  
    @Column({
      type: DataType.ARRAY(DataType.STRING),
      allowNull: true,
    })
    servicesSubcategories: string[];
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    description: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    profileImage: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    access_token: string;
  
    @Column({
      type: DataType.BOOLEAN,
      defaultValue: true,
    })
    isActive: boolean;
  
    @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
    })
    isVerified: boolean;
  }