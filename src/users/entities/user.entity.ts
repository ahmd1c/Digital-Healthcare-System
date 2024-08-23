import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true })
  passwordResetToken: string; // hashed

  @Column({ select: false, nullable: true })
  passwordResetExpires: Date;

  @Column({ select: false, nullable: true })
  passwordChangedAt: Date;

  @Column({ enum: ['patient', 'doctor', 'admin'], default: 'patient' })
  role: string;

  @Column()
  gender: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Patient, (patient) => patient.user, { cascade: true })
  patient: Patient;

  @OneToOne(() => Doctor, (doc) => doc.user, { cascade: true })
  doc: Doctor;
}
