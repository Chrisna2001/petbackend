import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsString,
  IsEnum,
  MaxLength,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    example: 30,
    description: 'User age',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Age cannot be negative' })
  @Max(120, { message: 'Age cannot exceed 120' })
  age?: number;

  @ApiProperty({
    example: 'male',
    description: 'User sex',
    enum: ['male', 'female', 'other'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'], { message: 'Sex must be male, female, or other' })
  sex?: string;

  @ApiProperty({
    example: 'New York, USA',
    description: 'User current location',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Location cannot exceed 255 characters' })
  currentLocation?: string;
}