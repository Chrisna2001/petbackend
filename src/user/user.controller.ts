import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtUserPayload } from '../auth/interfaces/user.interface';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user information with profile',
    type: UserResponseDto,
  })
  async getCurrentUser(@CurrentUser() user: JwtUserPayload) {
    const userData = await this.userService.getCurrentUserWithProfile(user.sub);
    const { password, access_token, ...result } = userData.get({ plain: true });
    return result;
  }
}