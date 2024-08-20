import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MedRecordsModule } from './med-records/med-records.module';
import { TimeslotsModule } from './timeslots/timeslots.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PatientsModule,
    DoctorsModule,
    ReviewsModule,
    AppointmentsModule,
    MedRecordsModule,
    TimeslotsModule,
    PrescriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
