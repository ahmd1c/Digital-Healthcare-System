import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard extends AuthGuard('jwt-access') {
  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const token = WsGuard.getToken(client);
    if (!token) throw new WsException('Missing authentication token');

    // pass the token to passport as the authorization header (Bearer <token>)
    client.handshake.headers.authorization = `Bearer ${token}`;
    return client.handshake;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    if (err || !user) {
      if (info?.message === 'jwt expired') {
        client.emit('token_expired', {
          message: 'Token has expired. Please refresh.',
        });
      }
      throw new WsException(info.message);
    }
    client.data.user = user;
    return user;
  }

  static getToken(socket: Socket) {
    let token: string | undefined;
    const { headers, auth } = socket.handshake;
    token = headers?.authorization?.split(' ')[1];

    if (!token && headers.cookie) {
      const cookies = socket.request['cookies'];
      token = cookies['access_token'];
    }

    if (!token && auth?.token) token = auth.token;
    return token;
  }
}

// const cookies = headers.cookie.split(';').reduce(
//   (acc, cookie) => {
//     const [key, value] = cookie.trim().split('=');
//     acc[key] = value;
//     return acc;
//   },
//   {} as Record<string, string>,
// );
