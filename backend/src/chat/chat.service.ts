import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private usersService: UsersService,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto, senderId: number): Promise<Message> {
    const sender = await this.usersService.findById(senderId);
    const receiver = await this.usersService.findById(createMessageDto.receiverId);

    const message = this.messagesRepository.create({
      text: createMessageDto.text,
      sender,
      receiver,
    });

    return this.messagesRepository.save(message);
  }

  async getMessageHistory(userId: number): Promise<Message[]> {
    return this.messagesRepository.find({
      where: [
        { sender: { id: userId } },
        { receiver: { id: userId } },
      ],
      relations: ['sender', 'receiver'],
      order: { timestamp: 'DESC' },
    });
  }
} 