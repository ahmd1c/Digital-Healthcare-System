import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Timeslot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  start_time: Date;

  @Column({ type: 'date' })
  end_time: Date;

  @Column({
    type: 'enum',
    enum: ['recurrent', 'single', 'unavailable'],
    default: 'recurrent',
  })
  type: string;

  @Column({ type: 'int', array: true, default: [] })
  days: number[];

  @Column({ type: 'date', nullable: true })
  date: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.timeslot)
  appointments: Appointment[];

  @ManyToOne(() => Doctor, (doctor) => doctor.timeslots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doc_id' })
  doctor: Doctor;
}
