import { Controller, Get, Param, Patch } from '@nestjs/common';
import { MessagesService } from './messages.service';
import User from 'src/utils/decorators/USER.decorator';

@Controller('chat')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':targetId')
  getMessages(@Param('targetId') targetId: number, @User() user) {
    return this.messagesService.getMessages(user.id, targetId);
  }

  @Patch(':targetId')
  markAsRead(@Param('targetId') targetId: number, @User() user) {
    return this.messagesService.markAsRead(user.id, targetId);
  }
}
