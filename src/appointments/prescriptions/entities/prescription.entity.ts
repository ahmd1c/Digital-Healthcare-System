import { Appointment } from 'src/appointments/entities/appointment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Prescription {
  @PrimaryColumn({ name: 'prescription_id', type: 'int' })
  @OneToOne(() => Appointment, (appointment) => appointment.prescription)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @Column({ type: 'jsonb' })
  prescription: unknown;

  @CreateDateColumn()
  date: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
