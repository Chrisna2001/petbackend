import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('DB Password Type:', typeof config.get('DB_PASSWORD')); // Debug
        return {
          dialect: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          autoLoadModels: true, // Load models from modules
          synchronize: false, // Disable auto-sync (use migrations)
          logging: config.get('DB_LOGGING') === 'true',
          retryDelay: 3000, // Wait 3 seconds between retries
          retryAttempts: 5, // Try 5 times
          dialectOptions: {
            ssl:
              config.get('DB_SSL') === 'true'
                ? {
                    require: true,
                    rejectUnauthorized: false, // For self-signed certs
                  }
                : false,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
