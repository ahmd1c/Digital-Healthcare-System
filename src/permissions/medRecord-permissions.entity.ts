import { Doctor } from 'src/doctors/entities/doctor.entity';
import { MedRecord } from 'src/med-records/entities/med-record.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MedRecordPermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.medRecordPermissions)
  @JoinColumn({ name: 'doc_id' })
  doctor: Doctor;

  @ManyToOne(() => MedRecord, (medRecord) => medRecord.medRecordPermissions)
  @JoinColumn({ name: 'med_record_id' })
  medRecord: MedRecord;

  @Column()
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
