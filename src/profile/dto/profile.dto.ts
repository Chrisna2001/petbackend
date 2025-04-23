import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsString,
  IsEnum,
} from 'class-validator';

export class ProfileDto {
  @ApiProperty({
    example: 30,
    description: 'User age',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(120)
  age?: number;

  @ApiProperty({
    example: 'male',
    description: 'User sex',
    enum: ['male', 'female', 'other'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  sex?: string;

  @ApiProperty({
    example: 'New York, USA',
    description: 'User current location',
    required: false,
  })
  @IsOptional()
  @IsString()
  currentLocation?: string;
}