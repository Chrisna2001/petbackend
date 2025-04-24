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
      comment: 'URL to the profile image',
    })
    profileImage: string;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: true,
      comment: 'User age in years',
      validate: {
        min: 0,
        max: 120,
      },
    })
    age: number;
  
    @Column({
      type: DataType.ENUM('male', 'female', 'other'),
      allowNull: true,
      comment: 'User sex/gender identity',
    })
    sex: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
      comment: 'Current location of the user',
    })
    currentLocation: string;
  
    @BelongsTo(() => User)
    user: User;
  }