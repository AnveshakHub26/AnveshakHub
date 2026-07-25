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
import { Logger } from '@nestjs/common';

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
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization;
    this.logger.log(`Client connected to Realtime Socket.IO: ${client.id}`);

    // Join general user notifications room
    client.join('room:notifications');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from Socket.IO: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }) {
    if (data?.room) {
      client.join(data.room);
      this.logger.log(`Client ${client.id} joined room: ${data.room}`);
      return { event: 'room_joined', room: data.room };
    }
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', timestamp: new Date().toISOString() };
  }

  // Broadcaster methods for system events
  emitNotification(userId: string, notification: any) {
    this.server.to('room:notifications').emit('notification', notification);
  }

  emitProjectUpdate(projectId: string, update: any) {
    this.server.to(`project:${projectId}`).emit('project_update', update);
  }

  emitMeetingUpdate(meetingId: string, update: any) {
    this.server.to(`meeting:${meetingId}`).emit('meeting_update', update);
  }

  emitDashboardRefresh() {
    this.server.emit('dashboard_refresh', { timestamp: new Date().toISOString() });
  }
}
