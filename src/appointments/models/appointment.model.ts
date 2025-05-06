import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.model';
import { Shop } from '../../shops/models/shop.model';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Table({
  tableName: 'appointments',
  timestamps: true,
})
export class Appointment extends Model {
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

  @ForeignKey(() => Shop)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  shopId: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  appointmentDate: Date;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  appointmentTime: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  service: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  subServices: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.ENUM(...Object.values(AppointmentStatus)),
    allowNull: false,
    defaultValue: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  cancellationReason: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Shop)
  shop: Shop;
}