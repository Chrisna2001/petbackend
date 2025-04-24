import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsDateString,
  MaxLength,
} from 'class-validator';

// Base DTO with shared properties for creating and updating pets
export class BasePetDto {
  @ApiProperty({
    example: 'Buddy',
    description: 'Name of the pet',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 3,
    description: 'Age of the pet in years',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  age?: number;

  @ApiProperty({
    example: 'male',
    description: 'Sex of the pet',
    enum: ['male', 'female', 'unknown'],
    required: false,
    default: 'unknown',
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'unknown'])
  sex?: string;

  @ApiProperty({
    example: 'Golden Retriever',
    description: 'Breed of the pet',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  breed?: string;

  @ApiProperty({
    example: 'dog',
    description: 'Type of pet',
    enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'other'],
  })
  @IsEnum(['dog', 'cat', 'bird', 'fish', 'reptile', 'other'])
  type: string;

  @ApiProperty({
    example: '2020-01-01',
    description: 'Date of birth of the pet (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dob?: string;
}

// DTO for creating a new pet
export class CreatePetDto extends BasePetDto {}

// DTO for updating an existing pet
export class UpdatePetDto {
  @ApiProperty({
    example: 'Buddy',
    description: 'Name of the pet',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: 3,
    description: 'Age of the pet in years',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  age?: number;

  @ApiProperty({
    example: 'male',
    description: 'Sex of the pet',
    enum: ['male', 'female', 'unknown'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'unknown'])
  sex?: string;

  @ApiProperty({
    example: 'Golden Retriever',
    description: 'Breed of the pet',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  breed?: string;

  @ApiProperty({
    example: 'dog',
    description: 'Type of pet',
    enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'other'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['dog', 'cat', 'bird', 'fish', 'reptile', 'other'])
  type?: string;

  @ApiProperty({
    example: '2020-01-01',
    description: 'Date of birth of the pet (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dob?: string;
}

// DTO for pet responses
export class PetResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the pet',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'User ID of the pet owner',
  })
  userId: number;

  @ApiProperty({
    example: 'Buddy',
    description: 'Name of the pet',
  })
  name: string;

  @ApiProperty({
    example: 3,
    description: 'Age of the pet in years',
  })
  age: number;

  @ApiProperty({
    example: 'male',
    description: 'Sex of the pet',
    enum: ['male', 'female', 'unknown'],
  })
  sex: string;

  @ApiProperty({
    example: 'Golden Retriever',
    description: 'Breed of the pet',
  })
  breed: string;

  @ApiProperty({
    example: 'dog',
    description: 'Type of pet',
    enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'other'],
  })
  type: string;

  @ApiProperty({
    example: '2020-01-01',
    description: 'Date of birth of the pet',
  })
  dob: Date;

  @ApiProperty({
    example: 'http://example.com/uploads/pet-123.jpg',
    description: 'URL to the pet image',
  })
  imageUrl: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the pet was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the pet was last updated',
  })
  updatedAt: Date;
}