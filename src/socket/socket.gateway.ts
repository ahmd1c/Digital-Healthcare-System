import { ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsGuard } from './socket-auth.guard';
import * as cookieParser from 'cookie-parser';
import { MsgDto } from 'src/messages/dtos/msgDto';
import { MessagesService } from 'src/messages/messages.service';
import { WsThrottlerGuard } from './throttle.wsGuard';

@Injectable()
@WebSocketGateway()
@UseGuards(WsThrottlerGuard, WsGuard)
export class SocketGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly wsGuard: WsGuard,
    private readonly messagesService: MessagesService,
  ) {}

  afterInit(io: Server) {
    io.engine.use(cookieParser());
    io.use(async (socket, next) => {
      try {
        // Manually create an ExecutionContext that the wsGuard can work with
        const context: ExecutionContext = this.createExecutionContext(socket);
        const canActivate = await this.wsGuard.canActivate(context);
        if (canActivate) next();
        else next(new Error('Unauthorized'));

        console.log('user', socket.data.user);
      } catch (error) {
        console.log('catch error', error);
        next(new WsException(error.message));
      }
    });
  }

  @SubscribeMessage('offer')
  handleOffer(socket: Socket, offer: any) {
    const targetPeerId = offer.targetPeerId;
    this.server.to(targetPeerId).emit('offer', offer);
  }

  @SubscribeMessage('answer')
  handleAnswer(socket: Socket, answer: any) {
    const targetPeerId = answer.targetPeerId;
    this.server.to(targetPeerId).emit('answer', answer);
  }

  @SubscribeMessage('iceCandidate')
  handleIceCandidate(socket: Socket, candidate: any) {
    const targetPeerId = candidate.targetPeerId;
    this.server.to(targetPeerId).emit('iceCandidate', candidate);
  }

  @SubscribeMessage('newMessage')
  handleMessage(socket: Socket, msg: MsgDto) {
    this.messagesService.sendMessage(msg);
    this.server.to(`${msg.to}`).emit('newMessage', msg);
  }

  @SubscribeMessage('markAsRead')
  handleMarkAsRead(socket: Socket, targetId: number) {
    this.messagesService.markAsRead(socket.data.user.id, targetId);
    this.server.to(`${targetId}`).emit('markAsRead', targetId);
  }

  createExecutionContext(socket: Socket): ExecutionContext {
    return {
      switchToWs: () => ({
        getClient: () => socket,
        getData: () => socket.handshake,
      }),
      switchToHttp: () => ({
        getRequest: () => socket.handshake,
        getResponse: () => null,
      }),
    } as ExecutionContext;
  }
}
