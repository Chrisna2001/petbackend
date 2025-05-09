import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UploadedFile,
  Req,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import {
  RegisterShopDto,
  ShopLoginDto,
  UpdateShopDto,
  ShopResponseDto,
  SearchShopDto,
  Zone,
  ServiceType,
} from './dto/shop.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtUserPayload } from '../auth/interfaces/user.interface';
import { SingleFileUpload } from '../common/upload/file-upload.decorators';
import { Request, Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
//   import { Roles } from '../auth/decorators/roles.decorator';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new shop' })
  @ApiResponse({
    status: 201,
    description: 'Shop successfully registered',
    type: ShopResponseDto,
  })
  async register(@Body() registerShopDto: RegisterShopDto) {
    
    return await this.shopsService.register(registerShopDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login shop' })
  @ApiResponse({
    status: 200,
    description: 'Shop successfully logged in',
    type: ShopResponseDto,
    headers: {
      Authorization: {
        description: 'Bearer token for authentication',
        schema: { type: 'string' },
      },
    },
  })
  async login(@Body() loginDto: ShopLoginDto, @Res() res: Response) {
    const { shop, access_token } = await this.shopsService.login(loginDto);

    res.setHeader('Authorization', `Bearer ${access_token}`);
    return res.json(shop);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all shops with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of shops',
    type: [ShopResponseDto],
  })
  async findAll(@Query() searchDto: SearchShopDto) {
    return await this.shopsService.findAll(searchDto);
  }

  @Public()
  @Get('by-zone/:zone')
  @ApiOperation({ summary: 'Get all shops by zone' })
  @ApiParam({
    name: 'zone',
    description: 'Zone to filter by',
    enum: Zone,
  })
  @ApiResponse({
    status: 200,
    description: 'List of shops in the specified zone',
    type: [ShopResponseDto],
  })
  async findByZone(@Param('zone') zone: Zone) {
    return await this.shopsService.findByZone(zone);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get shop by ID' })
  @ApiParam({ name: 'id', description: 'Shop ID' })
  @ApiResponse({
    status: 200,
    description: 'Shop details',
    type: ShopResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Shop not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.shopsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update shop details' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'Shop ID' })
  @ApiResponse({
    status: 200,
    description: 'Shop updated',
    type: ShopResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not authorized to update this shop',
  })
  @ApiResponse({
    status: 404,
    description: 'Shop not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return await this.shopsService.update(id, updateShopDto);
  }

  @Post(':id/upload-profile-image')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload shop profile image' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'Shop ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile image uploaded',
    type: ShopResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not authorized to update this shop',
  })
  @ApiResponse({
    status: 404,
    description: 'Shop not found',
  })
  @SingleFileUpload('profileImage')
  async uploadProfileImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.shopsService.updateProfileImage(id, file, req);
  }

  @Patch(':id/verify')
  @UseGuards(AuthGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a shop (admin only)' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'Shop ID' })
  @ApiResponse({
    status: 200,
    description: 'Shop verified',
    type: ShopResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Shop not found',
  })
  async verifyShop(@Param('id', ParseIntPipe) id: number) {
    return await this.shopsService.verifyShop(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate a shop' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'Shop ID' })
  @ApiResponse({
    status: 200,
    description: 'Shop deactivated',
    type: ShopResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not authorized to deactivate this shop',
  })
  @ApiResponse({
    status: 404,
    description: 'Shop not found',
  })
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return await this.shopsService.deactivate(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a shop (admin only)' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'Shop ID' })
  @ApiResponse({
    status: 204,
    description: 'Shop deleted',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Shop not found',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.shopsService.remove(id);
  }
}
