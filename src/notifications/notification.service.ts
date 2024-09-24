import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notifications } from './notifications.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications)
    private notificationRepository: Repository<Notifications>,
  ) {}

  notify(notification: Partial<Notifications> & { userId: number }) {
    const { userId, type, message } = notification;
    const newNotification = this.notificationRepository.create({
      user: { id: userId },
      type,
      message,
    });
    return this.notificationRepository.save(newNotification);
  }

  getNotifications(userId: number, read?: boolean) {
    return this.notificationRepository.find({
      where: { user: { id: userId }, read },
    });
  }

  readNotifications(userId: number) {
    return this.notificationRepository.update(
      { user: { id: userId } },
      { read: true },
    );
  }

  removeNotification(id: number) {
    return this.notificationRepository.delete({ id });
  }

  removeNotifications(userId: number) {
    return this.notificationRepository.delete({ user: { id: userId } });
  }

  removeReadNotifications(userId: number) {
    return this.notificationRepository.delete({
      user: { id: userId },
      read: true,
    });
  }
}
