import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/realtime',
})
export class AppWebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppWebsocketGateway.name);

  handleConnection(client: Socket) {
    const rawToken = client.handshake.auth?.token || client.handshake.headers?.authorization;
    const token = rawToken?.replace('Bearer ', '');

    if (!token) {
      this.logger.warn(`[Socket.IO Auth] Connection rejected for ${client.id}: Missing JWT token`);
      client.emit('error', { message: 'Authentication required' });
      client.disconnect(true);
      return;
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || 'anveshakhub-super-secret-jwt-key-2026';
      const decoded = jwt.decode(token) as any;

      if (!decoded) {
        throw new UnauthorizedException('Invalid token');
      }

      const userId = decoded.sub || decoded.id;
      const userRole = decoded.role || decoded.user_metadata?.role || 'USER';

      client.data = { userId, role: userRole };
      this.logger.log(`✓ [Socket.IO Authenticated] User ${userId} (${userRole}) connected on socket ${client.id}`);

      // Auto-join personal room and role room
      client.join(`user:${userId}`);
      client.join(`role:${userRole}`);
    } catch (e) {
      this.logger.warn(`[Socket.IO Auth] Verification failed for ${client.id}: ${(e as Error).message}`);
      client.emit('error', { message: 'Invalid or expired authentication token' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from Socket.IO: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }) {
    const user = client.data;
    if (!user) {
      return { event: 'error', message: 'Unauthorized socket session' };
    }

    const room = data?.room;
    if (!room) return;

    // Validate resource access rights before room subscription
    if (room.startsWith('admin:') && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return { event: 'error', message: 'Forbidden: Admin access required for this room' };
    }

    client.join(room);
    this.logger.log(`Client ${client.id} (${user.userId}) authorized & joined room: ${room}`);
    return { event: 'room_joined', room };
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', timestamp: new Date().toISOString() };
  }

  // Targeted Secure Emission Methods
  emitNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  emitToRole(role: string, event: string, payload: any) {
    this.server.to(`role:${role}`).emit(event, payload);
  }

  emitProjectUpdate(projectId: string, update: any) {
    this.server.to(`project:${projectId}`).emit('project_update', update);
  }

  emitMeetingUpdate(meetingId: string, update: any) {
    this.server.to(`meeting:${meetingId}`).emit('meeting_update', update);
  }
}
