import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
  ArrayMinSize,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

// Available zones
export enum Zone {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west',
  CENTRAL = 'central',
}

// Available services
export enum ServiceType {
  GROOMING = 'grooming',
  KENNEL = 'kennel',
  VET = 'vet',
  PET_SHOP = 'pet_shop',
  PET_ADOPTION = 'pet_adoption',
  PET_TRAINING = 'pet_training',
}

// Register shop DTO
export class RegisterShopDto {
  @ApiProperty({
    example: 'petshop1',
    description: 'Shop username for login',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Shop account password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Confirm the password',
  })
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @ApiProperty({
    example: 'PetZone Grooming & Kennel',
    description: 'Store name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  storeName: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Shop owner name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ownerName: string;

  @ApiProperty({
    example: '22AAAAA0000A1Z5',
    description: 'GSTIN number of the shop',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: 'Invalid GSTIN format',
  })
  gstinNumber: string;

  @ApiProperty({
    example: '+919876543210',
    description: 'Phone number with country code',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]+$/, {
    message: 'Phone number can only contain numbers and optional + prefix',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'north',
    description: 'Zone where the shop is located',
    enum: Zone,
  })
  @IsEnum(Zone)
  @IsNotEmpty()
  zone: Zone;

  @ApiProperty({
    example: ['grooming', 'kennel'],
    description: 'Services offered by the shop',
    enum: ServiceType,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(ServiceType, { each: true })
  servicesOffered: ServiceType[];

  @ApiProperty({
    example: ['dog grooming', 'cat grooming', 'luxury kennel'],
    description: 'Service subcategories',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicesSubcategories?: string[];

  @ApiProperty({
    example: 'Premium pet grooming and kennel services with professional staff.',
    description: 'Description of the shop',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}

// Shop login DTO
export class ShopLoginDto {
  @ApiProperty({
    example: 'petshop1',
    description: 'Shop username',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Shop password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

// Update shop DTO
export class UpdateShopDto {
  @ApiProperty({
    example: 'PetZone Grooming & Kennel - New Branch',
    description: 'Store name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  storeName?: string;

  @ApiProperty({
    example: 'John Smith',
    description: 'Shop owner name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ownerName?: string;

  @ApiProperty({
    example: '+919876543211',
    description: 'Phone number with country code',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]+$/, {
    message: 'Phone number can only contain numbers and optional + prefix',
  })
  phoneNumber?: string;

  @ApiProperty({
    example: 'north',
    description: 'Zone where the shop is located',
    enum: Zone,
    required: false,
  })
  @IsOptional()
  @IsEnum(Zone)
  zone?: Zone;

  @ApiProperty({
    example: ['grooming', 'kennel', 'vet'],
    description: 'Services offered by the shop',
    enum: ServiceType,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(ServiceType, { each: true })
  servicesOffered?: ServiceType[];

  @ApiProperty({
    example: ['dog grooming', 'cat grooming', 'premium kennel'],
    description: 'Service subcategories',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicesSubcategories?: string[];

  @ApiProperty({
    example: 'Updated shop description with new services.',
    description: 'Description of the shop',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the shop is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Shop response DTO
export class ShopResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Shop ID',
  })
  id: number;

  @ApiProperty({
    example: 'petshop1',
    description: 'Shop username',
  })
  username: string;

  @ApiProperty({
    example: 'PetZone Grooming & Kennel',
    description: 'Store name',
  })
  storeName: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Shop owner name',
  })
  ownerName: string;

  @ApiProperty({
    example: '22AAAAA0000A1Z5',
    description: 'GSTIN number',
  })
  gstinNumber: string;

  @ApiProperty({
    example: '+919876543210',
    description: 'Phone number',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'north',
    description: 'Zone',
    enum: Zone,
  })
  zone: Zone;

  @ApiProperty({
    example: ['grooming', 'kennel'],
    description: 'Services offered',
    enum: ServiceType,
    isArray: true,
  })
  servicesOffered: ServiceType[];

  @ApiProperty({
    example: ['dog grooming', 'cat grooming', 'luxury kennel'],
    description: 'Service subcategories',
  })
  servicesSubcategories: string[];

  @ApiProperty({
    example: 'Premium pet grooming and kennel services with professional staff.',
    description: 'Description',
  })
  description: string;

  @ApiProperty({
    example: 'http://example.com/uploads/shop-profile-123.jpg',
    description: 'Profile image URL',
  })
  profileImage: string;

  @ApiProperty({
    example: true,
    description: 'Whether the shop is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the shop is verified',
  })
  isVerified: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Shop creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Shop last update date',
  })
  updatedAt: Date;
}

// Shop search DTO
export class SearchShopDto {
  @ApiProperty({
    example: 'north',
    description: 'Filter shops by zone',
    enum: Zone,
    required: false,
  })
  @IsOptional()
  @IsEnum(Zone)
  zone?: Zone;

  @ApiProperty({
    example: 'grooming',
    description: 'Filter shops by service',
    enum: ServiceType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ServiceType)
  service?: ServiceType;

  @ApiProperty({
    example: 'pet',
    description: 'Search term to match against shop name or description',
    required: false,
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;
}