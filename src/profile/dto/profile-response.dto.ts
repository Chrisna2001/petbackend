import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Profile ID',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  userId: number;

  @ApiProperty({
    example: 'http://example.com/uploads/profile-123.jpg',
    description: 'Profile image URL',
    required: false,
  })
  profileImage?: string;

  @ApiProperty({
    example: 30,
    description: 'User age',
    required: false,
  })
  age?: number;

  @ApiProperty({
    example: 'male',
    description: 'User sex',
    enum: ['male', 'female', 'other'],
    required: false,
  })
  sex?: string;

  @ApiProperty({
    example: 'New York, USA',
    description: 'User current location',
    required: false,
  })
  currentLocation?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Profile creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Profile last update date',
  })
  updatedAt: Date;
}