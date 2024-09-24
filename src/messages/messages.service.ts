import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Messages } from './entity/messages.entity';
import { Repository } from 'typeorm';
import { MsgDto } from 'src/messages/dtos/msgDto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
  ) {}

  sendMessage(msg: MsgDto) {
    const newMsg = this.messagesRepository.create(msg);
    return this.messagesRepository.save(newMsg);
  }

  getMessages(userId: number, targetId: number) {
    return this.messagesRepository.find({
      where: [
        { from: userId, to: targetId },
        { from: targetId, to: userId },
      ],
    });
  }

  markAsRead(userId: number, targetId: number) {
    return this.messagesRepository.update(
      { from: userId, to: targetId },
      { isRead: true },
    );
  }
}
