import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  trainNumber: string;

  @Column()
  departureStation: string;

  @Column()
  arrivalStation: string;

  @Column()
  departureTime: Date;

  @Column()
  arrivalTime: Date;

  @Column()
  platform: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 