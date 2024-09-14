import { Appointment } from 'src/appointments/entities/appointment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  prescription: unknown;

  @CreateDateColumn()
  date: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Appointment, (appointment) => appointment.prescription)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;
}
