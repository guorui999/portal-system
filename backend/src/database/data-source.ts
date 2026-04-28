import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Admin } from '../entities/admin.entity';
import { System } from '../entities/system.entity';
import { PortalConfig } from '../entities/portal-config.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get('DB_HOST', 'mysql'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'admin'),
        database: configService.get('DB_DATABASE', 'portal_system'),
        entities: [Admin, System, PortalConfig],
        synchronize: false, // 生产环境应该使用 migrations
        logging: false,
      });

      await dataSource.initialize();
      return dataSource;
    },
    inject: [ConfigService],
  },
];
