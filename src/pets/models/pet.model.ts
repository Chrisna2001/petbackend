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
    tableName: 'pets',
    timestamps: true,
  })
  export class Pet extends Model {
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
    name: string;
  
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
      type: DataType.STRING,
      allowNull: true,
    })
    breed: string;
  
    @Column({
      type: DataType.ENUM('dog', 'cat', 'bird', 'fish', 'reptile', 'other'),
      allowNull: false,
    })
    type: string;
  
    @Column({
      type: DataType.DATEONLY,
      allowNull: true,
    })
    dob: Date;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    imageUrl: string;
  
    @BelongsTo(() => User)
    user: User;
  }