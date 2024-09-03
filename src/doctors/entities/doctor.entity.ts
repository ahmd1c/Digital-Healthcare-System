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
import { MedRecordPermissions } from 'src/permissions/medRecord-permissions.entity';

type Education = {
  degree: string;
  institution: string;
  year: number;
};

@Entity()
export class Doctor {
  @PrimaryColumn({ type: 'int' })
  doc_id: number;

  @Column()
  specialization: string;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  schedule_price: number;

  @Column()
  schedule_duration: number; // in minutes

  @Column({ default: false })
  approved: boolean;

  @Column({ type: 'jsonb' })
  education: Education[];

  @OneToOne(() => User, (user) => user.doc)
  @JoinColumn({ name: 'doc_id' })
  user: User;

  @OneToMany(() => Timeslot, (timeslot) => timeslot.doctor)
  timeslots: Timeslot[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(
    () => MedRecordPermissions,
    (medRecordPermissions) => medRecordPermissions.doctor,
  )
  medRecordPermissions: MedRecordPermissions[];

  @OneToMany(() => DocExperience, (docExperience) => docExperience.doc)
  experiences: DocExperience[];

  @OneToMany(() => Review, (review) => review.doctor)
  reviews: Review[];
}
