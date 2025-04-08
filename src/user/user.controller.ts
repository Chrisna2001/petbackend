import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserResponseDto } from './dto/user-response.dto';

@ApiBearerAuth('access-token') // This must match the key in DocumentBuilder
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile', type: UserResponseDto })
  async getProfile(@Req() req): Promise<Partial<User>> {
    const user = await this.userService.findById(req.user.sub);
    const { password, access_token, ...result } = user.get({ plain: true });
    return result;
  }
}