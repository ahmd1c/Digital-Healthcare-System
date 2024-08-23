import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Timeslot } from 'src/timeslots/entities/timeslot.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { DocExperience } from '../doc_experiences/entities/doc_experience.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Entity()
export class Doctor {
  @PrimaryColumn()
  @OneToOne(() => User, (user) => user.doc)
  @JoinColumn({ name: 'doc_id' })
  user: User;

  @Column()
  specialization: string;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  schedule_price: number;

  @Column()
  schedule_duration: number; // in minutes

  @Column()
  approved: boolean;

  @Column({ type: 'jsonb', array: true })
  education: { degree: string; institution: string; year: number }[];

  @OneToMany(() => Timeslot, (timeslot) => timeslot.doc)
  timeslots: Timeslot[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => DocExperience, (docExperience) => docExperience.doc)
  experiences: DocExperience[];

  @OneToMany(() => Review, (review) => review.doctor)
  reviews: Review[];
}
