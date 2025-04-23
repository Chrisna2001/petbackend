import { ApiProperty } from '@nestjs/swagger';
// import { ProfileResponseDto } from '../../profile/dto/profile-response.dto';
import { ProfileResponseDto } from 'src/profile/dto/profile-response.dto';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  id: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
  })
  name: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Username',
  })
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'User phone number',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'user',
    description: 'User role',
    enum: ['user', 'admin'],
  })
  role: string;

  @ApiProperty({
    example: false,
    description: 'Whether the user is verified',
  })
  isVerified: boolean;

  @ApiProperty({
    description: 'User profile',
    type: ProfileResponseDto,
    required: false,
  })
  profile?: ProfileResponseDto;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'User creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'User last update date',
  })
  updatedAt: Date;
}