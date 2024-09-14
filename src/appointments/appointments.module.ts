import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { TimeslotsModule } from 'src/timeslots/timeslots.module';
import { NotificationModule } from 'src/notifications/notification.module';
import MailService from 'src/utils/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    TimeslotsModule,
    NotificationModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, MailService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
