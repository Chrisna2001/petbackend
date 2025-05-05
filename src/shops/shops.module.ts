import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Shop } from './models/shop.model';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { GlobalUploadModule } from '../common/upload/global-upload.module';
import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from '../auth/guards/roles.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([Shop]),
    GlobalUploadModule,
  ],
  controllers: [ShopsController],
  providers: [
    ShopsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [ShopsService],
})
export class ShopsModule {}