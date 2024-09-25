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
import { PrescriptionsModule } from './appointments/prescriptions/prescriptions.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Constants from './utils/Constants';
import { MedHistoryModule } from './med-records/med_history/med_history.module';
import { PatientMedicationsModule } from './med-records/patient_medications/patient_medications.module';
import { DocExperiencesModule } from './doctors/doc_experiences/doc_experiences.module';
import { SocketGateway } from './socket/socket.gateway';
import { WsGuard } from './socket/socket-auth.guard';
import { MessagesModule } from './messages/messages.module';
import { ScheduleModule } from '@nestjs/schedule';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { WsThrottlerGuard } from './socket/throttle.wsGuard';

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Constants.DB_HOST,
      port: Number(Constants.DB_PORT),
      username: Constants.DB_USER,
      password: Constants.DB_PASSWORD,
      database: Constants.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    MedHistoryModule,
    PatientMedicationsModule,
    DocExperiencesModule,
    MessagesModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: minutes(15),
        limit: 100,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SocketGateway,
    WsGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    WsThrottlerGuard,
  ],
})
export class AppModule {}
