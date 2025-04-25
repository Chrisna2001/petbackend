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
    tableName: 'pet_listings',
    timestamps: true,
  })
  export class PetListing extends Model {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;
  
    @ForeignKey(() => User)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    userId: number;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    petName: string;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: true,
    })
    age: number;
  
    @Column({
      type: DataType.ENUM('male', 'female', 'unknown'),
      allowNull: true,
      defaultValue: 'unknown',
    })
    sex: string;
  
    @Column({
      type: DataType.ENUM('dog', 'cat', 'bird', 'fish', 'reptile', 'other'),
      allowNull: false,
    })
    type: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    breed: string;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
    })
    price: number;
  
    @Column({
      type: DataType.DATEONLY,
      allowNull: true,
    })
    dob: Date;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    ownerName: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    description: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    petImageUrl: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    licenseImageUrl: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    licenseNo: string;
  
    @Column({
      type: DataType.BOOLEAN,
      defaultValue: true,
    })
    isActive: boolean;
  
    @BelongsTo(() => User)
    user: User;
  }