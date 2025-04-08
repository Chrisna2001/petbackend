import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestModule } from './test/test.module';
import { LogsModule } from './logs/logs.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { Log } from './logs/models/logs.model';
import { CorsMiddleware } from './middlewares/cors.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './exceptionfilter/global-exception.filter';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user/models/user.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    // Configure JwtModule globally
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '0',
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
    SequelizeModule.forFeature([Log]),
    DatabaseModule,
    TestModule,
    LogsModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    // Register AuthGuard globally
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, LoggingMiddleware).forRoutes('*');
  }
}
