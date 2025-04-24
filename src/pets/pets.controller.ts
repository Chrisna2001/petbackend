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
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
  } from '@nestjs/swagger';
  import { PetsService } from './pets.service';
  import { CreatePetDto, UpdatePetDto, PetResponseDto } from './dto/pet.dto';
  import { AuthGuard } from '../auth/guards/auth.guard';
  import { CurrentUser } from '../auth/decorators/current-user.decorator';
  import { JwtUserPayload } from '../auth/interfaces/user.interface';
  import { SingleFileUpload } from '../common/upload/file-upload.decorators';
  import { Request } from 'express';
  
  @ApiTags('pets')
  @Controller('pets')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  export class PetsController {
    constructor(private readonly petsService: PetsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new pet' })
    @ApiResponse({
      status: 201,
      description: 'Pet successfully created',
      type: PetResponseDto,
    })
    async create(
      @CurrentUser() user: JwtUserPayload,
      @Body() createPetDto: CreatePetDto,
    ) {
      return await this.petsService.create(user.sub, createPetDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all pets for the current user' })
    @ApiResponse({
      status: 200,
      description: 'List of pets',
      type: [PetResponseDto],
    })
    async findAll(@CurrentUser() user: JwtUserPayload) {
      return await this.petsService.findAllByUser(user.sub);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a pet by ID' })
    @ApiParam({ name: 'id', description: 'Pet ID' })
    @ApiResponse({
      status: 200,
      description: 'Pet found',
      type: PetResponseDto,
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden - Pet does not belong to user',
    })
    @ApiResponse({
      status: 404,
      description: 'Pet not found',
    })
    async findOne(
      @CurrentUser() user: JwtUserPayload,
      @Param('id', ParseIntPipe) id: number,
    ) {
      const pet = await this.petsService.findOne(id);
      // Check ownership before returning the pet
      if (pet.userId !== user.sub) {
        await this.petsService.checkOwnership(id, user.sub);
      }
      return pet;
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a pet' })
    @ApiParam({ name: 'id', description: 'Pet ID' })
    @ApiResponse({
      status: 200,
      description: 'Pet updated',
      type: PetResponseDto,
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden - Pet does not belong to user',
    })
    @ApiResponse({
      status: 404,
      description: 'Pet not found',
    })
    async update(
      @CurrentUser() user: JwtUserPayload,
      @Param('id', ParseIntPipe) id: number,
      @Body() updatePetDto: UpdatePetDto,
    ) {
      return await this.petsService.update(id, user.sub, updatePetDto);
    }
  
    @Post(':id/upload-image')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Upload pet image' })
    @ApiParam({ name: 'id', description: 'Pet ID' })
    @ApiResponse({
      status: 200,
      description: 'Pet image uploaded',
      type: PetResponseDto,
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden - Pet does not belong to user',
    })
    @ApiResponse({
      status: 404,
      description: 'Pet not found',
    })
    @SingleFileUpload('petImage')
    async uploadPetImage(
      @CurrentUser() user: JwtUserPayload,
      @Param('id', ParseIntPipe) id: number,
      @UploadedFile() file: Express.Multer.File,
      @Req() req: Request,
    ) {
      return await this.petsService.updatePetImage(id, user.sub, file, req);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a pet' })
    @ApiParam({ name: 'id', description: 'Pet ID' })
    @ApiResponse({
      status: 204,
      description: 'Pet deleted',
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden - Pet does not belong to user',
    })
    @ApiResponse({
      status: 404,
      description: 'Pet not found',
    })
    async remove(
      @CurrentUser() user: JwtUserPayload,
      @Param('id', ParseIntPipe) id: number,
    ) {
      await this.petsService.remove(id, user.sub);
    }
  }