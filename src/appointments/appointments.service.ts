import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Appointment, AppointmentStatus } from './models/appointment.model';
import { ShopSchedule, DayOfWeek } from '../shops/models/shop-schedule.model';
import { Shop } from '../shops/models/shop.model';
import { User } from '../user/models/user.model';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  CancelAppointmentDto,
  FilterAppointmentDto,
  TimeSlotResponseDto,
  ShopScheduleDto,
  SetShopScheduleDto,
} from './dto/appointment.dto';
import { Op, Sequelize, literal } from 'sequelize';
import * as moment from 'moment';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(ShopSchedule)
    private readonly shopScheduleModel: typeof ShopSchedule,
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

    // Get day of week
    const appointmentDate = moment(createAppointmentDto.appointmentDate);
    const dayOfWeek = appointmentDate.format('dddd').toLowerCase() as DayOfWeek;

    // Check if shop is open on that day
    const shopSchedule = await this.shopScheduleModel.findOne({
      where: {
        shopId: createAppointmentDto.shopId,
        day: dayOfWeek,
        isOpen: true,
      },
    });

    if (!shopSchedule) {
      throw new BadRequestException(`Shop is closed on ${dayOfWeek}`);
    }

    // Check if appointment time is within shop hours
    const appointmentTime = moment(createAppointmentDto.appointmentTime, 'HH:mm');
    const openTime = moment(shopSchedule.openTime, 'HH:mm:ss');
    const closeTime = moment(shopSchedule.closeTime, 'HH:mm:ss');

    if (appointmentTime.isBefore(openTime) || appointmentTime.isAfter(closeTime)) {
      throw new BadRequestException(
        `Appointment time must be between ${openTime.format('HH:mm')} and ${closeTime.format('HH:mm')}`,
      );
    }

    // Check if the time slot is available
    const timeSlots = await this.generateTimeSlots(
      createAppointmentDto.shopId,
      createAppointmentDto.appointmentDate,
    );

    const selectedSlot = timeSlots.find(
      (slot) => slot.startTime === createAppointmentDto.appointmentTime
    );

    if (!selectedSlot) {
      throw new BadRequestException('Invalid time slot');
    }

    if (!selectedSlot.available) {
      throw new ConflictException('This time slot is no longer available');
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
      const newDate = updateAppointmentDto.appointmentDate || appointment.appointmentDate;
      const newTime = updateAppointmentDto.appointmentTime || appointment.appointmentTime;

      // Validate the new date and time
      await this.validateAppointmentDateTime(appointment.shopId, newDate, newTime, id);
    }

    // Update appointment
    await appointment.update(updateAppointmentDto);

    return this.findOne(id);
  }

  /**
   * Validate if a date and time are valid for an appointment
   */
 /**
   * Validate if a date and time are valid for an appointment
   */
 private async validateAppointmentDateTime(
  shopId: number,
  date: string | Date,
  time: string,
  excludeAppointmentId?: number,
): Promise<void> {
  // Convert Date object to string if needed
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  
  // Get day of week
  const appointmentDate = moment(dateStr);
  const dayOfWeek = appointmentDate.format('dddd').toLowerCase() as DayOfWeek;

  // Check if shop is open on that day
  const shopSchedule = await this.shopScheduleModel.findOne({
    where: {
      shopId,
      day: dayOfWeek,
      isOpen: true,
    },
  });

  if (!shopSchedule) {
    throw new BadRequestException(`Shop is closed on ${dayOfWeek}`);
  }

  // Check if appointment time is within shop hours
  const appointmentTime = moment(time, 'HH:mm');
  const openTime = moment(shopSchedule.openTime, 'HH:mm:ss');
  const closeTime = moment(shopSchedule.closeTime, 'HH:mm:ss');

  if (appointmentTime.isBefore(openTime) || appointmentTime.isAfter(closeTime)) {
    throw new BadRequestException(
      `Appointment time must be between ${openTime.format('HH:mm')} and ${closeTime.format('HH:mm')}`,
    );
  }

  // Check if the time slot is available
  const timeSlots = await this.generateTimeSlots(shopId, dateStr, excludeAppointmentId);

  const selectedSlot = timeSlots.find((slot) => slot.startTime === time);

  if (!selectedSlot) {
    throw new BadRequestException('Invalid time slot');
  }

  if (!selectedSlot.available) {
    throw new ConflictException('This time slot is no longer available');
  }
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

  /**
   * Get all available time slots for a shop on a specific date
   */
  async getAvailableTimeSlots(
    shopId: number,
    date: string,
  ): Promise<TimeSlotResponseDto[]> {
    // Check if shop exists
    const shop = await this.shopModel.findByPk(shopId);
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${shopId} not found`);
    }

    // Generate time slots
    return this.generateTimeSlots(shopId, date);
  }

  /**
   * Helper method to generate time slots
   */
  private async generateTimeSlots(
    shopId: number,
    date: string,
    excludeAppointmentId?: number,
  ): Promise<TimeSlotResponseDto[]> {
    // Get day of week
    const appointmentDate = moment(date);
    const dayOfWeek = appointmentDate.format('dddd').toLowerCase() as DayOfWeek;

    // Get shop schedule for that day
    const shopSchedule = await this.shopScheduleModel.findOne({
      where: {
        shopId,
        day: dayOfWeek,
        isOpen: true,
      },
    });

    if (!shopSchedule) {
      return []; // Shop is closed on this day
    }

    const openTime = moment(shopSchedule.openTime, 'HH:mm:ss');
    const closeTime = moment(shopSchedule.closeTime, 'HH:mm:ss');
    const slotDuration = shopSchedule.slotDuration || 60; // Default 60 minutes
    const maxAppointmentsPerSlot = shopSchedule.maxAppointmentsPerSlot || 1;

    // Get existing appointments for this shop on this date
    const whereClause: any = {
      shopId,
      appointmentDate: date,
      status: {
        [Op.notIn]: [AppointmentStatus.CANCELLED],
      },
    };

    // Exclude a specific appointment if updating
    if (excludeAppointmentId) {
      whereClause.id = {
        [Op.ne]: excludeAppointmentId,
      };
    }

    const existingAppointments = await this.appointmentModel.findAll({
      where: whereClause,
      attributes: ['appointmentTime', [Sequelize.fn('count', '*'), 'count']],
      group: ['appointmentTime'],
      raw: true,
    });

    // Create a map of time slot to count
    const appointmentCounts = new Map<string, number>();
    existingAppointments.forEach((app: any) => {
      appointmentCounts.set(app.appointmentTime, parseInt(app.count));
    });

    // Generate time slots
    const slots: TimeSlotResponseDto[] = [];
    let currentTime = openTime.clone();

    while (currentTime.isBefore(closeTime)) {
      const startTime = currentTime.format('HH:mm');
      const endTime = currentTime.clone().add(slotDuration, 'minutes').format('HH:mm');
      
      const bookedCount = appointmentCounts.get(startTime) || 0;
      const available = bookedCount < maxAppointmentsPerSlot;

      slots.push({
        startTime,
        endTime,
        available,
        bookedCount,
        maxAppointments: maxAppointmentsPerSlot,
      });

      currentTime.add(slotDuration, 'minutes');
    }

    return slots;
  }

  /**
   * Set shop schedule
   */
  async setShopSchedule(shopId: number, scheduleDto: SetShopScheduleDto): Promise<ShopSchedule[]> {
    // Check if shop exists
    const shop = await this.shopModel.findByPk(shopId);
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${shopId} not found`);
    }

    // Delete existing schedule
    await this.shopScheduleModel.destroy({
      where: { shopId },
    });

    // Create new schedule
    const schedules = await Promise.all(
      scheduleDto.schedule.map(async (daySchedule) => {
        return this.shopScheduleModel.create({
          shopId,
          day: daySchedule.day,
          openTime: daySchedule.openTime,
          closeTime: daySchedule.closeTime,
          isOpen: daySchedule.isOpen !== undefined ? daySchedule.isOpen : true,
          slotDuration: daySchedule.slotDuration || 60,
          maxAppointmentsPerSlot: daySchedule.maxAppointmentsPerSlot || 1,
        });
      }),
    );

    return schedules;
  }

  /**
   * Get shop schedule
   */
  async getShopSchedule(shopId: number): Promise<ShopSchedule[]> {
    // Check if shop exists
    const shop = await this.shopModel.findByPk(shopId);
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${shopId} not found`);
    }

    return this.shopScheduleModel.findAll({
      where: { shopId },
      order: [
        [
          Sequelize.literal(
            `CASE 
              WHEN day = 'monday' THEN 1 
              WHEN day = 'tuesday' THEN 2 
              WHEN day = 'wednesday' THEN 3 
              WHEN day = 'thursday' THEN 4 
              WHEN day = 'friday' THEN 5 
              WHEN day = 'saturday' THEN 6 
              WHEN day = 'sunday' THEN 7 
            END`,
          ),
          'ASC',
        ],
      ],
    });
  }

  /**
   * Initialize default shop schedule
   */
  async initializeDefaultSchedule(shopId: number): Promise<ShopSchedule[]> {
    // Check if shop exists
    const shop = await this.shopModel.findByPk(shopId);
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${shopId} not found`);
    }

    // Check if schedule already exists
    const existingSchedule = await this.shopScheduleModel.findOne({
      where: { shopId },
    });

    if (existingSchedule) {
      throw new BadRequestException('Schedule already exists for this shop');
    }

    // Create default schedule (Monday to Saturday, 9 AM to 6 PM)
    const days = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ];

    const schedules = await Promise.all(
      days.map(async (day) => {
        return this.shopScheduleModel.create({
          shopId,
          day,
          openTime: '09:00:00',
          closeTime: '18:00:00',
          isOpen: true,
          slotDuration: 60, // 1 hour slots
          maxAppointmentsPerSlot: 2, // 2 appointments per slot
        });
      }),
    );

    // Add Sunday (closed)
    await this.shopScheduleModel.create({
      shopId,
      day: DayOfWeek.SUNDAY,
      openTime: '09:00:00',
      closeTime: '18:00:00',
      isOpen: false, // Closed on Sunday
      slotDuration: 60,
      maxAppointmentsPerSlot: 2,
    });

    return this.getShopSchedule(shopId);
  }
}