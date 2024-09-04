import { Patient } from 'src/patients/entities/patient.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { MedHistory } from '../med_history/entities/med_history.entity';
import { PatientMedication } from '../patient_medications/entities/patient_medication.entity';
import { MedRecordPermissions } from 'src/permissions/medRecord-permissions.entity';

@Entity()
export class MedRecord {
  @PrimaryColumn({ name: 'med_record_id', type: 'int' })
  med_record_id: number;

  @Column({ length: 3 })
  blood_group: string;

  @Column({ type: 'jsonb', nullable: true })
  allergies: { type: string; description: string }[];

  @Column({ type: 'jsonb', nullable: true })
  past_surgeries: { name: string; description: string }[];

  @Column()
  smooker: boolean;

  @Column({ nullable: true })
  cigarets_per_day: number;

  @Column({ nullable: true })
  parity: number;

  @Column({ nullable: true })
  gravidity: number;

  @Column()
  height: number; // in cm

  @OneToOne(() => Patient, (patient) => patient.medRecord)
  @JoinColumn({ name: 'med_record_id' })
  patient: Patient;

  @OneToMany(
    () => MedRecordPermissions,
    (medRecordPermissions) => medRecordPermissions.medRecord,
  )
  medRecordPermissions: MedRecordPermissions[];

  @OneToMany(() => MedHistory, (medHistory) => medHistory.med_record)
  med_history: MedHistory[];

  @OneToMany(
    () => PatientMedication,
    (patientMedication) => patientMedication.med_record,
  )
  patientMedication: PatientMedication[];
}
