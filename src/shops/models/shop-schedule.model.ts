import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Shop } from './shop.model';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Table({
  tableName: 'shop_schedules',
  timestamps: true,
})
export class ShopSchedule extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Shop)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  shopId: number;

  @Column({
    type: DataType.ENUM(...Object.values(DayOfWeek)),
    allowNull: false,
  })
  day: DayOfWeek;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    defaultValue: '09:00:00',
  })
  openTime: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    defaultValue: '18:00:00',
  })
  closeTime: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isOpen: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 60,
    comment: 'Slot duration in minutes',
  })
  slotDuration: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Maximum appointments per slot',
  })
  maxAppointmentsPerSlot: number;

  @BelongsTo(() => Shop)
  shop: Shop;
}