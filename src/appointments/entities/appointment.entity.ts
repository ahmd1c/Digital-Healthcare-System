import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Timeslot } from 'src/timeslots/entities/timeslot.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Prescription } from '../prescriptions/entities/prescription.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['visit', 'telemedicine'],
    default: 'visit',
  })
  type: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'finished', 'cancelled'],
  })
  status: string;

  @Column()
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Prescription, (prescription) => prescription.appointment)
  prescription: Prescription;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doc_id' })
  doctor: Doctor;

  @ManyToOne(() => Timeslot, (timeslot) => timeslot.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'timeslot_id' })
  timeslot: Timeslot;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
