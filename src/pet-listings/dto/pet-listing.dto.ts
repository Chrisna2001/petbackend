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
  IsPositive,
  IsBoolean,
  
} from 'class-validator';

// Base DTO with shared properties
export class BasePetListingDto {
  @ApiProperty({
    example: 'Buddy',
    description: 'Name of the pet',
  })
  @IsString()
  @MaxLength(100)
  petName: string;

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
    example: 'dog',
    description: 'Type of pet',
    enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'other'],
  })
  @IsEnum(['dog', 'cat', 'bird', 'fish', 'reptile', 'other'])
  type: string;

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
    example: 299.99,
    description: 'Price of the pet in dollars',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  
  price: number;

  @ApiProperty({
    example: '2020-01-01',
    description: 'Date of birth of the pet (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the pet owner',
  })
  @IsString()
  @MaxLength(100)
  ownerName: string;

  @ApiProperty({
    example: 'Friendly, well-trained dog looking for a new home.',
    description: 'Description of the pet',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    example: 'LIC-12345',
    description: 'License number of the pet',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  licenseNo?: string;
}

// DTO for creating a new pet listing
export class CreatePetListingDto extends BasePetListingDto {}

// DTO for updating an existing pet listing
export class UpdatePetListingDto {
  @ApiProperty({
    example: 'Buddy',
    description: 'Name of the pet',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  petName?: string;

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
    example: 'dog',
    description: 'Type of pet',
    enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'other'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['dog', 'cat', 'bird', 'fish', 'reptile', 'other'])
  type?: string;

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
    example: 299.99,
    description: 'Price of the pet in dollars',
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
 
  price?: number;

  @ApiProperty({
    example: '2020-01-01',
    description: 'Date of birth of the pet (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the pet owner',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ownerName?: string;

  @ApiProperty({
    example: 'Friendly, well-trained dog looking for a new home.',
    description: 'Description of the pet',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    example: 'LIC-12345',
    description: 'License number of the pet',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  licenseNo?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the listing is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// DTO for pet listing responses
export class PetListingResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the listing',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'User ID of the listing creator',
  })
  userId: number;

  @ApiProperty({
    example: 'Buddy',
    description: 'Name of the pet',
  })
  petName: string;

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
    example: 'dog',
    description: 'Type of pet',
    enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'other'],
  })
  type: string;

  @ApiProperty({
    example: 'Golden Retriever',
    description: 'Breed of the pet',
  })
  breed: string;

  @ApiProperty({
    example: 299.99,
    description: 'Price of the pet in dollars',
  })
  price: number;

  @ApiProperty({
    example: '2020-01-01',
    description: 'Date of birth of the pet',
  })
  dob: Date;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the pet owner',
  })
  ownerName: string;

  @ApiProperty({
    example: 'Friendly, well-trained dog looking for a new home.',
    description: 'Description of the pet',
  })
  description: string;

  @ApiProperty({
    example: 'http://example.com/uploads/pet-123.jpg',
    description: 'URL to the pet image',
  })
  petImageUrl: string;

  @ApiProperty({
    example: 'http://example.com/uploads/license-123.jpg',
    description: 'URL to the license image',
  })
  licenseImageUrl: string;

  @ApiProperty({
    example: 'LIC-12345',
    description: 'License number of the pet',
  })
  licenseNo: string;

  @ApiProperty({
    example: true,
    description: 'Whether the listing is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the listing was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the listing was last updated',
  })
  updatedAt: Date;
}

// DTO for searching/filtering pet listings
export class SearchPetListingDto {
  @ApiProperty({
    example: 'dog',
    description: 'Type of pet to filter by',
    enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'other'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['dog', 'cat', 'bird', 'fish', 'reptile', 'other'])
  type?: string;

  @ApiProperty({
    example: 'Golden Retriever',
    description: 'Breed to filter by',
    required: false,
  })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiProperty({
    example: 300,
    description: 'Maximum price to filter by',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxPrice?: number;

  @ApiProperty({
    example: 50,
    description: 'Minimum price to filter by',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    example: 'male',
    description: 'Sex to filter by',
    enum: ['male', 'female', 'unknown'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'unknown'])
  sex?: string;
}