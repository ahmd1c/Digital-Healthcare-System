import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import MailService from 'src/utils/mail.service';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { PatientsModule } from 'src/patients/patients.module';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    DoctorsModule,
    PatientsModule,
    NotificationModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
