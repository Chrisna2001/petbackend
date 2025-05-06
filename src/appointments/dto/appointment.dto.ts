import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsInt,
  IsPositive,
  IsDateString,
  Matches,
  MaxLength,
  IsNotEmpty,
  ArrayMinSize,
} from 'class-validator';

// DTO for appointment responses

import { AppointmentStatus } from '../models/appointment.model';
import { ShopResponseDto } from '../../shops/dto/shop.dto';
import { UserResponseDto } from '../../user/dto/user-response.dto';

// DTO for creating a new appointment
export class CreateAppointmentDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the shop to book',
  })
  @IsInt()
  @IsPositive()
  shopId: number;

  @ApiProperty({
    example: '2023-07-15',
    description: 'Date of the appointment (YYYY-MM-DD)',
  })
  @IsDateString()
  appointmentDate: string;

  @ApiProperty({
    example: '14:30',
    description: 'Time of the appointment (HH:MM in 24-hour format)',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in format HH:MM (24-hour)',
  })
  appointmentTime: string;

  @ApiProperty({
    example: 'grooming',
    description: 'Main service requested',
  })
  @IsString()
  @IsNotEmpty()
  service: string;

  @ApiProperty({
    example: ['dog grooming', 'nail trimming'],
    description: 'Specific sub-services requested',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subServices?: string[];

  @ApiProperty({
    example: 'Please be gentle with my dog, he gets nervous.',
    description: 'Additional notes for the appointment',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

// DTO for updating an appointment
export class UpdateAppointmentDto {
  @ApiProperty({
    example: '2023-07-20',
    description: 'Updated date of the appointment (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  appointmentDate?: string;

  @ApiProperty({
    example: '16:30',
    description: 'Updated time of the appointment (HH:MM in 24-hour format)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in format HH:MM (24-hour)',
  })
  appointmentTime?: string;

  @ApiProperty({
    example: 'grooming',
    description: 'Updated main service requested',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  service?: string;

  @ApiProperty({
    example: ['dog grooming', 'bath', 'nail trimming'],
    description: 'Updated specific sub-services requested',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subServices?: string[];

  @ApiProperty({
    example: 'My dog needs special shampoo for sensitive skin.',
    description: 'Updated additional notes for the appointment',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    example: 'confirmed',
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}

// DTO for cancelling an appointment
export class CancelAppointmentDto {
  @ApiProperty({
    example: 'Schedule conflict',
    description: 'Reason for cancellation',
  })
  @IsString()
  @MaxLength(500)
  cancellationReason: string;
}



export class AppointmentResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the appointment',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'User ID who made the appointment',
  })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'Shop ID where the appointment is booked',
  })
  shopId: number;

  @ApiProperty({
    example: '2023-07-15',
    description: 'Date of the appointment',
  })
  appointmentDate: string;

  @ApiProperty({
    example: '14:30:00',
    description: 'Time of the appointment',
  })
  appointmentTime: string;

  @ApiProperty({
    example: 'grooming',
    description: 'Main service requested',
  })
  service: string;

  @ApiProperty({
    example: ['dog grooming', 'nail trimming'],
    description: 'Specific sub-services requested',
  })
  subServices: string[];

  @ApiProperty({
    example: 'Please be gentle with my dog, he gets nervous.',
    description: 'Additional notes for the appointment',
  })
  notes: string;

  @ApiProperty({
    example: 'confirmed',
    description: 'Status of the appointment',
    enum: AppointmentStatus,
  })
  status: AppointmentStatus;

  @ApiProperty({
    example: 'Schedule conflict',
    description: 'Reason for cancellation (if cancelled)',
  })
  cancellationReason: string;

  @ApiProperty({
    example: '2023-06-01T14:30:00.000Z',
    description: 'When the appointment was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-06-01T14:30:00.000Z',
    description: 'When the appointment was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Shop details',
    type: ShopResponseDto,
    required: false,
  })
  shop?: ShopResponseDto;

  @ApiProperty({
    description: 'User details',
    type: UserResponseDto,
    required: false,
  })
  user?: UserResponseDto;
}

// DTO for filtering appointments
export class FilterAppointmentDto {
  @ApiProperty({
    example: 'pending',
    description: 'Filter by appointment status',
    enum: AppointmentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty({
    example: '2023-07-15',
    description: 'Filter by specific date (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    example: 1,
    description: 'Filter by shop ID',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  shopId?: number;

  @ApiProperty({
    example: true,
    description: 'Get only upcoming appointments (future dates)',
    required: false,
  })
  @IsOptional()
  upcoming?: boolean;

  @ApiProperty({
    example: true,
    description: 'Get only past appointments (dates in the past)',
    required: false,
  })
  @IsOptional()
  past?: boolean;
}

// DTO for shop time slots
export class TimeSlotResponseDto {
  @ApiProperty({
    example: '09:00',
    description: 'Start time of the slot (HH:MM)',
  })
  startTime: string;

  @ApiProperty({
    example: '10:00',
    description: 'End time of the slot (HH:MM)',
  })
  endTime: string;

  @ApiProperty({
    example: true,
    description: 'Whether the slot is available for booking',
  })
  available: boolean;

  @ApiProperty({
    example: 2,
    description: 'Number of appointments already booked in this slot',
    required: false,
  })
  bookedCount?: number;

  @ApiProperty({
    example: 3,
    description: 'Maximum number of appointments allowed per slot',
    required: false,
  })
  maxAppointments?: number;
}

// DTO for shop schedule
export class ShopScheduleDto {
  @ApiProperty({
    example: 'monday',
    description: 'Day of the week',
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  })
  @IsEnum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
  day: string;

  @ApiProperty({
    example: '09:00',
    description: 'Opening time (HH:MM)',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in format HH:MM (24-hour)',
  })
  openTime: string;

  @ApiProperty({
    example: '18:00',
    description: 'Closing time (HH:MM)',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in format HH:MM (24-hour)',
  })
  closeTime: string;

  @ApiProperty({
    example: true,
    description: 'Whether the shop is open on this day',
  })
  @IsOptional()
  isOpen?: boolean;

  @ApiProperty({
    example: 60,
    description: 'Duration of each appointment slot in minutes',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  slotDuration?: number;

  @ApiProperty({
    example: 2,
    description: 'Maximum number of appointments per time slot',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxAppointmentsPerSlot?: number;
}

// DTO for setting shop schedule
export class SetShopScheduleDto {
  @ApiProperty({
    type: [ShopScheduleDto],
    description: 'Weekly schedule for the shop',
  })
  @IsArray()
  @ArrayMinSize(1)
  schedule: ShopScheduleDto[];
}

// DTO for getting available slots
export class GetAvailableSlotsDto {
  @ApiProperty({
    example: '2023-07-15',
    description: 'Date to check for available slots (YYYY-MM-DD)',
  })
  @IsDateString()
  date: string;
}