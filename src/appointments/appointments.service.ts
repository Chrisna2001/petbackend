import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Appointment, AppointmentStatus } from './models/appointment.model';
import { Shop } from '../shops/models/shop.model';
import { User } from '../user/models/user.model';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  CancelAppointmentDto,
  FilterAppointmentDto,
} from './dto/appointment.dto';
import { Op, Sequelize } from 'sequelize';
import * as moment from 'moment';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(Shop)
    private readonly shopModel: typeof Shop,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  /**
   * Create a new appointment
   */
  async create(userId: number, createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Validate shop exists
    const shop = await this.shopModel.findByPk(createAppointmentDto.shopId);
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${createAppointmentDto.shopId} not found`);
    }

    // Validate shop is active and verified
    // if (!shop.isActive || !shop.isVerified) {
    //   throw new BadRequestException('Shop is not available for booking');
    // }

    // Validate service is offered by the shop
    if (!shop.servicesOffered.includes(createAppointmentDto.service)) {
      throw new BadRequestException(`Service '${createAppointmentDto.service}' is not offered by this shop`);
    }

    // Validate appointment time is within shop hours (9 AM to 6 PM)
    const appointmentTime = moment(createAppointmentDto.appointmentTime, 'HH:mm');
    const openTime = moment('09:00', 'HH:mm');
    const closeTime = moment('18:00', 'HH:mm');

    if (appointmentTime.isBefore(openTime) || appointmentTime.isAfter(closeTime)) {
      throw new BadRequestException(
        `Appointment time must be between 09:00 and 18:00`,
      );
    }

    // Check if there's already an appointment at this time
    const existingAppointment = await this.appointmentModel.findOne({
      where: {
        shopId: createAppointmentDto.shopId,
        appointmentDate: createAppointmentDto.appointmentDate,
        appointmentTime: createAppointmentDto.appointmentTime,
        status: {
          [Op.notIn]: [AppointmentStatus.CANCELLED],
        },
      },
    });

    if (existingAppointment) {
      throw new ConflictException('This time slot is already booked');
    }

    // Create the appointment
    return await this.appointmentModel.create({
      userId,
      shopId: createAppointmentDto.shopId,
      appointmentDate: createAppointmentDto.appointmentDate,
      appointmentTime: createAppointmentDto.appointmentTime,
      service: createAppointmentDto.service,
      subServices: createAppointmentDto.subServices || [],
      notes: createAppointmentDto.notes,
      status: AppointmentStatus.PENDING,
    });
  }

  /**
   * Find all appointments for a user with filtering
   */
  async findAllForUser(userId: number, filterDto: FilterAppointmentDto): Promise<Appointment[]> {
    const whereClause: any = {
      userId,
    };

    // Apply filters
    this.applyFilters(whereClause, filterDto);

    return this.appointmentModel.findAll({
      where: whereClause,
      include: [
        {
          model: Shop,
          attributes: ['id', 'storeName', 'ownerName', 'phoneNumber', 'profileImage'],
        },
      ],
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']],
    });
  }

  /**
   * Find all appointments for a shop with filtering
   */
  async findAllForShop(shopId: number, filterDto: FilterAppointmentDto): Promise<Appointment[]> {
    const whereClause: any = {
      shopId,
    };

    // Apply filters
    this.applyFilters(whereClause, filterDto);

    return this.appointmentModel.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'username', 'email', 'phoneNumber'],
        },
      ],
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']],
    });
  }

  /**
   * Helper method to apply filters to query
   */
  private applyFilters(whereClause: any, filterDto: FilterAppointmentDto): void {
    if (filterDto.status) {
      whereClause.status = filterDto.status;
    }

    if (filterDto.date) {
      whereClause.appointmentDate = filterDto.date;
    }

    if (filterDto.shopId) {
      whereClause.shopId = filterDto.shopId;
    }

    // Filter for upcoming appointments (future dates)
    if (filterDto.upcoming) {
      whereClause.appointmentDate = {
        [Op.gte]: moment().format('YYYY-MM-DD'),
      };
    }

    // Filter for past appointments
    if (filterDto.past) {
      whereClause.appointmentDate = {
        [Op.lt]: moment().format('YYYY-MM-DD'),
      };
    }
  }

  /**
   * Find an appointment by ID
   */
  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentModel.findByPk(id, {
      include: [
        {
          model: Shop,
          attributes: ['id', 'storeName', 'ownerName', 'phoneNumber', 'profileImage'],
        },
        {
          model: User,
          attributes: ['id', 'name', 'username', 'email', 'phoneNumber'],
        },
      ],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  /**
   * Check if an appointment belongs to a user
   */
  async checkOwnership(appointmentId: number, userId: number): Promise<Appointment> {
    const appointment = await this.findOne(appointmentId);

    if (appointment.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this appointment');
    }

    return appointment;
  }

  /**
   * Check if an appointment belongs to a shop
   */
  async checkShopOwnership(appointmentId: number, shopId: number): Promise<Appointment> {
    const appointment = await this.findOne(appointmentId);

    if (appointment.shopId !== shopId) {
      throw new ForbiddenException('This appointment does not belong to your shop');
    }

    return appointment;
  }

  /**
   * Update an appointment (by user)
   */
  async update(
    id: number,
    userId: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.checkOwnership(id, userId);

    // Check if appointment is already cancelled or completed
    if (
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.COMPLETED
    ) {
      throw new BadRequestException(
        `Cannot update a ${appointment.status.toLowerCase()} appointment`,
      );
    }

    // If changing date or time, validate availability
    if (updateAppointmentDto.appointmentDate || updateAppointmentDto.appointmentTime) {
      const newDate = updateAppointmentDto.appointmentDate || appointment.appointmentDate.toString();
      const newTime = updateAppointmentDto.appointmentTime || appointment.appointmentTime;

      // Validate the new time is within shop hours
      if (updateAppointmentDto.appointmentTime) {
        const appointmentTime = moment(updateAppointmentDto.appointmentTime, 'HH:mm');
        const openTime = moment('09:00', 'HH:mm');
        const closeTime = moment('18:00', 'HH:mm');

        if (appointmentTime.isBefore(openTime) || appointmentTime.isAfter(closeTime)) {
          throw new BadRequestException(
            `Appointment time must be between 09:00 and 18:00`,
          );
        }
      }

      // Check if there's already an appointment at this time (except this one)
      const existingAppointment = await this.appointmentModel.findOne({
        where: {
          shopId: appointment.shopId,
          appointmentDate: newDate,
          appointmentTime: newTime,
          id: { [Op.ne]: id },
          status: {
            [Op.notIn]: [AppointmentStatus.CANCELLED],
          },
        },
      });

      if (existingAppointment) {
        throw new ConflictException('This time slot is already booked');
      }
    }

    // Update appointment
    await appointment.update(updateAppointmentDto);

    return this.findOne(id);
  }

  /**
   * Update an appointment (by shop/admin)
   */
  async updateByShop(
    id: number,
    shopId: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.checkShopOwnership(id, shopId);

    // Update appointment
    await appointment.update(updateAppointmentDto);

    return this.findOne(id);
  }

  /**
   * Cancel an appointment (by user)
   */
  async cancel(
    id: number,
    userId: number,
    cancelDto: CancelAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.checkOwnership(id, userId);

    // Check if appointment is already cancelled or completed
    if (
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.COMPLETED
    ) {
      throw new BadRequestException(
        `Cannot cancel a ${appointment.status.toLowerCase()} appointment`,
      );
    }

    // Check if appointment is in the past
    const appointmentDateTime = moment(
      `${appointment.appointmentDate} ${appointment.appointmentTime}`,
      'YYYY-MM-DD HH:mm:ss',
    );

    if (appointmentDateTime.isBefore(moment())) {
      throw new BadRequestException('Cannot cancel an appointment that has already passed');
    }

    // Update appointment
    await appointment.update({
      status: AppointmentStatus.CANCELLED,
      cancellationReason: cancelDto.cancellationReason,
    });

    return this.findOne(id);
  }

  /**
   * Cancel an appointment (by shop/admin)
   */
  async cancelByShop(
    id: number,
    shopId: number,
    cancelDto: CancelAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.checkShopOwnership(id, shopId);

    // Check if appointment is already cancelled or completed
    if (
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.COMPLETED
    ) {
      throw new BadRequestException(
        `Cannot cancel a ${appointment.status.toLowerCase()} appointment`,
      );
    }

    // Update appointment
    await appointment.update({
      status: AppointmentStatus.CANCELLED,
      cancellationReason: cancelDto.cancellationReason,
    });

    return this.findOne(id);
  }

  /**
   * Complete an appointment (by shop/admin)
   */
  async complete(id: number, shopId: number): Promise<Appointment> {
    const appointment = await this.checkShopOwnership(id, shopId);

    // Check if appointment is already cancelled or completed
    if (
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.COMPLETED
    ) {
      throw new BadRequestException(
        `Cannot complete a ${appointment.status.toLowerCase()} appointment`,
      );
    }

    // Update appointment
    await appointment.update({
      status: AppointmentStatus.COMPLETED,
    });

    return this.findOne(id);
  }
}