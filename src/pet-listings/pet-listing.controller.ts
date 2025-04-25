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
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
  } from '@nestjs/swagger';
//   import { PetListingsService } from './pet-listings.service';
import { PetListingsService } from './pet-listing.service';
  import { 
    CreatePetListingDto, 
    UpdatePetListingDto, 
    PetListingResponseDto,
    SearchPetListingDto 
  } from './dto/pet-listing.dto';
  import { AuthGuard } from '../auth/guards/auth.guard';
  import { CurrentUser } from '../auth/decorators/current-user.decorator';
  import { JwtUserPayload } from '../auth/interfaces/user.interface';
  import { SingleFileUpload } from '../common/upload/file-upload.decorators';
  import { Request } from 'express';
  import { Public } from '../auth/decorators/public.decorator';
  
  @ApiTags('pet-listings')
  @Controller('pet-listings')
  @ApiBearerAuth('access-token')
  export class PetListingsController {
    constructor(private readonly petListingsService: PetListingsService) {}
  
    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create a new pet listing' })
    @ApiResponse({
      status: 201,
      description: 'Pet listing successfully created',
      type: PetListingResponseDto,
    })
    async create(
      @CurrentUser() user: JwtUserPayload,
      @Body() createPetListingDto: CreatePetListingDto,
    ) {
      return await this.petListingsService.create(user.sub, createPetListingDto);
    }
  
    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all active pet listings with optional filters' })
    @ApiResponse({
      status: 200,
      description: 'List of pet listings',
      type: [PetListingResponseDto],
    })
    async findAll(@Query() searchDto: SearchPetListingDto) {
      return await this.petListingsService.findAll(searchDto);
    }
  
    @Get('my-listings')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get all pet listings created by the current user' })
    @ApiResponse({
      status: 200,
      description: 'List of current user\'s pet listings',
      type: [PetListingResponseDto],
    })
    async findMyListings(@CurrentUser() user: JwtUserPayload) {
      return await this.petListingsService.findAllByUser(user.sub);
    }
  
    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Get a pet listing by ID' })
    @ApiParam({ name: 'id', description: 'Pet listing ID' })
    @ApiResponse({
      status: 200,
      description: 'Pet listing found',
      type: PetListingResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'Pet listing not found',
    })
    async findOne(@Param('id', ParseIntPipe) id: number) {
      return await this.petListingsService.findOne(id);
    }
  
    @Patch(':id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update a pet listing' })
    @ApiParam({ name: 'id', description: 'Pet listing ID' })
    @ApiResponse({
      status: 200,
      description: 'Pet listing updated',
      type: PetListingResponseDto,
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden - Listing does not belong to user',
    })
    @ApiResponse({
      status: 404,
      description: 'Pet listing not found',
    })
    async update(
      @CurrentUser() user: JwtUserPayload,
      @Param('id', ParseIntPipe) id: number,
      @Body() updatePetListingDto: UpdatePetListingDto,
    ) {
      return await this.petListingsService.update(id, user.sub, updatePetListingDto);
    }
  
    @Post(':id/upload-pet-image')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Upload pet image for a listing' })
    @ApiParam({ name: 'id', description: 'Pet listing ID' })
    @ApiResponse({
      status: 200,
      description: 'Pet image uploaded',
      type: PetListingResponseDto,
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden - Listing does not belong to user',
    })
    @ApiResponse({
      status: 404,
      description: 'Pet listing not found',
    })
    @SingleFileUpload('petImage')
    async uploadPetImage(
      @CurrentUser() user: JwtUserPayload,
      @Param('id', ParseIntPipe) id: number,
      @UploadedFile() file: Express.Multer.File,
      @Req() req: Request,
    ) {
      return await this.petListingsService.updatePetImage(id, user.sub, file, req);
    }
  
    @Post(':id/upload-license-image')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Upload license image for a listing' })
    @ApiParam({ name: 'id', description: 'Pet listing ID' })
    @ApiResponse({
      status: 200,
      description: 'License image uploaded',
      type: PetListingResponseDto,
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden - Listing does not belong to user',
    })
    @ApiResponse({
      status: 404,
      description: 'Pet listing not found',
    })
    @SingleFileUpload('licenseImage')
    async uploadLicenseImage(
      @CurrentUser() user: JwtUserPayload,
      @Param('id', ParseIntPipe) id: number,
      @UploadedFile() file: Express.Multer.File,
      @Req() req: Request,
    ) {
      return await this.petListingsService.updateLicenseImage(id, user.sub, file, req);
    }
  
    @Patch(':id/deactivate')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Mark a pet listing as inactive (sold or no longer available)' })
    @ApiParam({ name: 'id', description: 'Pet listing ID' })
    @ApiResponse({
      status: 200,
      description: 'Pet listing deactivated',
      type: PetListingResponseDto,
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden - Listing does not belong to user',
    })
    @ApiResponse({
      status: 404,
      description: 'Pet listing not found',
    })
    async deactivate(
      @CurrentUser() user: JwtUserPayload,
      @Param('id', ParseIntPipe) id: number,
    ) {
      return await this.petListingsService.deactivate(id, user.sub);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a pet listing' })
    @ApiParam({ name: 'id', description: 'Pet listing ID' })
    @ApiResponse({
      status: 204,
      description: 'Pet listing deleted',
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden - Listing does not belong to user',
    })
    @ApiResponse({
      status: 404,
      description: 'Pet listing not found',
    })
    async remove(
      @CurrentUser() user: JwtUserPayload,
      @Param('id', ParseIntPipe) id: number,
    ) {
      await this.petListingsService.remove(id, user.sub);
    }
  }