import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('portal_config')
export class PortalConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  target: string; // 'sales' | 'test'

  @Column({ type: 'varchar', length: 500, nullable: true })
  backgroundImage: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  adminUrl: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  externalSystemUrl: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
