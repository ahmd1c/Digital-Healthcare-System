import { Appointment } from 'src/appointments/entities/appointment.entity';
import { MedRecord } from 'src/med-records/entities/med-record.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Patient extends BaseEntity {
  @PrimaryColumn()
  @OneToOne(() => User, (user) => user.patient)
  @JoinColumn({ name: 'patient_id' })
  user: User;

  @Column()
  marital_status: string;

  @Column()
  occupation: string;

  @Column()
  nationality: string;

  @Column()
  emergency_phone: string;

  @Column()
  date_of_birth: Date;

  @OneToOne(() => MedRecord, (medRecord) => medRecord.patient)
  @JoinColumn()
  medRecord: MedRecord;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => Review, (review) => review.patient)
  reviews: Review[];
}
