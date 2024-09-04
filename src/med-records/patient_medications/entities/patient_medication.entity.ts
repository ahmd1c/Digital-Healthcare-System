import { MedRecord } from 'src/med-records/entities/med-record.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PatientMedication {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'med_record_id' })
  @ManyToOne(() => MedRecord, (medRecord) => medRecord.patientMedication)
  med_record: MedRecord;

  @Column()
  name: string;

  @Column()
  dose: string;

  @Column({ enum: ['started', 'stopped', 'completed'] })
  status: string;

  @Column()
  start_date: Date;

  @Column({ nullable: true })
  end_date: Date;
}
