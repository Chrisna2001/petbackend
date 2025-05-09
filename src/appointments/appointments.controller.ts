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
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  CancelAppointmentDto,
  AppointmentResponseDto,
  FilterAppointmentDto,
} from './dto/appointment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtUserPayload } from '../auth/interfaces/user.interface';
// import { Roles } from '../auth/decorators/roles.decorator';
import { Roles } from 'src/auth/guards/roles.decorator';
import { AppointmentStatus } from './models/appointment.model';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'Appointment successfully created',
    type: AppointmentResponseDto,
  })
  async create(
    @CurrentUser() user: JwtUserPayload,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return await this.appointmentsService.create(user.sub, createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments for the current user with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of appointments',
    type: [AppointmentResponseDto],
  })
  async findAll(@CurrentUser() user: JwtUserPayload, @Query() filterDto: FilterAppointmentDto) {
    return await this.appointmentsService.findAllForUser(user.sub, filterDto);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get all upcoming appointments for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of upcoming appointments',
    type: [AppointmentResponseDto],
  })
  async findUpcoming(@CurrentUser() user: JwtUserPayload) {
    const filterDto: FilterAppointmentDto = {
      upcoming: true,
      status: AppointmentStatus.PENDING,
    };
    return await this.appointmentsService.findAllForUser(user.sub, filterDto);
  }

  @Get('cancelled')
  @ApiOperation({ summary: 'Get all cancelled appointments for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of cancelled appointments',
    type: [AppointmentResponseDto],
  })
  async findCancelled(@CurrentUser() user: JwtUserPayload) {
    const filterDto: FilterAppointmentDto = {
      status: AppointmentStatus.CANCELLED,
    };
    return await this.appointmentsService.findAllForUser(user.sub, filterDto);
  }

  @Get('completed')
  @ApiOperation({ summary: 'Get all completed appointments for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of completed appointments',
    type: [AppointmentResponseDto],
  })
  async findCompleted(@CurrentUser() user: JwtUserPayload) {
    const filterDto: FilterAppointmentDto = {
      status: AppointmentStatus.COMPLETED,
    };
    return await this.appointmentsService.findAllForUser(user.sub, filterDto);
  }

  @Get('shop/:shopId')
  @Roles('admin', 'shop')
  @ApiOperation({ summary: 'Get all appointments for a shop with optional filters (shop/admin only)' })
  @ApiParam({ name: 'shopId', description: 'Shop ID' })
  @ApiResponse({
    status: 200,
    description: 'List of appointments for the shop',
    type: [AppointmentResponseDto],
  })
  async findAllForShop(
    @Param('shopId', ParseIntPipe) shopId: number,
    @Query() filterDto: FilterAppointmentDto,
  ) {
    return await this.appointmentsService.findAllForShop(shopId, filterDto);
  }

  @Get('shop/:shopId/today')
  @Roles('admin', 'shop')
  @ApiOperation({ summary: "Get today's appointments for a shop (shop/admin only)" })
  @ApiParam({ name: 'shopId', description: 'Shop ID' })
  @ApiResponse({
    status: 200,
    description: 'List of today\'s appointments for the shop',
    type: [AppointmentResponseDto],
  })
  async findTodayForShop(@Param('shopId', ParseIntPipe) shopId: number) {
    const today = new Date().toISOString().split('T')[0];
    const filterDto: FilterAppointmentDto = {
      date: today,
    };
    return await this.appointmentsService.findAllForShop(shopId, filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment details',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtUserPayload) {
    const appointment = await this.appointmentsService.findOne(id);
    
    // Check ownership or admin/shop role
    if (appointment.userId !== user.sub && user.role !== 'admin' && user.role !== 'shop') {
      // If the user is not the appointment owner, admin, or shop, check ownership
      // This will throw a ForbiddenException if not the owner
      await this.appointmentsService.checkOwnership(id, user.sub);
    }
    
    return appointment;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment updated',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not your appointment',
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return await this.appointmentsService.update(id, user.sub, updateAppointmentDto);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment cancelled',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not your appointment',
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelDto: CancelAppointmentDto,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return await this.appointmentsService.cancel(id, user.sub, cancelDto);
  }

  @Post('shop/:shopId/:id/cancel')
  @Roles('admin', 'shop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an appointment (shop/admin only)' })
  @ApiParam({ name: 'shopId', description: 'Shop ID' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment cancelled',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not your shop',
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  async cancelByShop(
    @Param('shopId', ParseIntPipe) shopId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelDto: CancelAppointmentDto,
  ) {
    return await this.appointmentsService.cancelByShop(id, shopId, cancelDto);
  }

  @Post('shop/:shopId/:id/complete')
  @Roles('admin', 'shop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark an appointment as completed (shop/admin only)' })
  @ApiParam({ name: 'shopId', description: 'Shop ID' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment marked as completed',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not your shop',
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  async complete(
    @Param('shopId', ParseIntPipe) shopId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.appointmentsService.complete(id, shopId);
  }
}