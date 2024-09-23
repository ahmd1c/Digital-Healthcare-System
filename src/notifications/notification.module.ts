import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './notifications.entity';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notifications])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
