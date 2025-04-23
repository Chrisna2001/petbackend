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
    tableName: 'profiles',
    timestamps: true,
  })
  export class Profile extends Model {
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
      allowNull: true,
    })
    profileImage: string;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: true,
    })
    age: number;
  
    @Column({
      type: DataType.ENUM('male', 'female', 'other'),
      allowNull: true,
    })
    sex: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    currentLocation: string;
  
    @BelongsTo(() => User)
    user: User;
  }