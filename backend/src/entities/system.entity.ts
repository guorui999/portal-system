import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('system')
@Index(['target'])
export class System {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  type: string; // 'internal' | 'external'

  @Column({ type: 'varchar', length: 500, nullable: true })
  externalUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 20 })
  target: string; // 'sales' | 'test'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
