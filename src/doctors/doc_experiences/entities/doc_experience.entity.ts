import { Doctor } from 'src/doctors/entities/doctor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DocExperience {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, (doc) => doc.experiences)
  @JoinColumn({ name: 'doc_id' })
  doc: Doctor;

  @Column()
  hospital: string;

  @Column()
  description: string;

  @Column()
  from: Date;

  @Column()
  to: Date;
}
