import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Meetings & Video Conferencing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  @ApiOperation({ summary: 'Schedule a virtual R&D consultation meeting' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateMeetingDto) {
    return this.meetingsService.create(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update scheduled meeting parameters' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.meetingsService.update(id, dto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a scheduled meeting' })
  async cancel(@Param('id') id: string) {
    return this.meetingsService.cancel(id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join virtual meeting room' })
  async join(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.meetingsService.join(id, userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get user meeting history' })
  async getHistory(@CurrentUser('id') userId: string) {
    return this.meetingsService.getHistory(userId);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: 'Get meeting participant list' })
  async getParticipants(@Param('id') id: string) {
    return this.meetingsService.getParticipants(id);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Save meeting notes and action items' })
  async saveNotes(@Param('id') id: string, @Body('notes') notes: string) {
    return this.meetingsService.saveNotes(id, notes);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Get user meeting calendar agenda' })
  async getCalendar(@CurrentUser('id') userId: string) {
    return this.meetingsService.getCalendar(userId);
  }
}
