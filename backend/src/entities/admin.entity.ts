import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
