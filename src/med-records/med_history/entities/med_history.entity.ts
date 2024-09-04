import { MedRecord } from 'src/med-records/entities/med-record.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MedHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'med_record_id' })
  @ManyToOne(() => MedRecord, (medRecord) => medRecord.med_history)
  med_record: MedRecord;

  @Column()
  description: string;

  @Column()
  diagnosis: string;

  @Column({ enum: ['cured', 'not_cured'] })
  status: string;

  @Column({ nullable: true })
  prescription: string;

  @Column()
  start_date: Date;

  @Column({ nullable: true })
  end_date: Date;
}
