import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { QueryService } from 'src/utils/query-prepare.service';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), NotificationModule],
  controllers: [DoctorsController],
  providers: [DoctorsService, QueryService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
