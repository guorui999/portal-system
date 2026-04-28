import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Admin } from '../src/entities/admin.entity';
import { PortalConfig } from '../src/entities/portal-config.entity';
import { System } from '../src/entities/system.entity';
import bcrypt from 'bcrypt';

console.log('🚀 种子脚本开始执行...');

async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'mysql',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'portal_system',
    entities: [Admin, PortalConfig, System], // System 虽然未被直接操作，但会同步表结构
    synchronize: true, // 初始化时自动同步，无需再手动调用
  });

  try {
    console.log('🔄 正在初始化数据库连接...');
    await dataSource.initialize();
    console.log('✅ 数据库连接及表结构同步完成');

    const adminRepo = dataSource.getRepository(Admin);
    const configRepo = dataSource.getRepository(PortalConfig);

    // 创建默认管理员
    const existingAdmin = await adminRepo.findOne({ where: { username: 'admin' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await adminRepo.save(adminRepo.create({ username: 'admin', password: hashedPassword }));
      console.log('✅ 创建默认管理员用户: admin / admin123');
    } else {
      console.log('ℹ️ 管理员用户已存在，跳过创建');
    }

    // 创建默认门户配置
    const existingConfig = await configRepo.findOne({ where: { target: 'sales' } });
    if (!existingConfig) {
      await configRepo.save(configRepo.create({
        target: 'sales',
        backgroundImage: '/default-bg.jpg',
        adminUrl: 'http://localhost:3000',
        ipAddress: null,
        externalSystemUrl: null,
      }));
      console.log('✅ 创建默认门户配置');
    } else {
      console.log('ℹ️ 门户配置已存在，跳过创建');
    }

    console.log('🎉 种子数据完成');
  } catch (error) {
    console.error('❌ 种子数据失败:', error);
    process.exit(1);
  } finally {
    // 确保数据库连接关闭
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

seed();