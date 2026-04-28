import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Admin } from '../entities/admin.entity';
import { System } from '../entities/system.entity';
import { PortalConfig } from '../entities/portal-config.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'mysql'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'admin'),
        database: configService.get('DB_DATABASE', 'portal_system'),
        entities: [Admin, System, PortalConfig],
        synchronize: true, // 开发环境自动同步表结构
        logging: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
