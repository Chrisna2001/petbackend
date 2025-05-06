import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Appointment } from './models/appointment.model';
import { ShopSchedule } from '../shops/models/shop-schedule.model';
import { Shop } from '../shops/models/shop.model';
import { User } from '../user/models/user.model';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { RolesGuard } from '../auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    SequelizeModule.forFeature([Appointment, ShopSchedule, Shop, User]),
  ],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}