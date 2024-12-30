import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async getMessages(
    @GetUser() user: User,
    @Query('userId') userId: number,
  ) {
    return this.chatService.getMessages(user.id, userId);
  }

  @Post('messages')
  async createMessage(
    @GetUser() user: User,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatService.createMessage(user.id, createMessageDto);
  }
} 