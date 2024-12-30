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
    private messageRepository: Repository<Message>,
    private usersService: UsersService,
  ) {}

  async createMessage(senderId: number, createMessageDto: CreateMessageDto) {
    const sender = await this.usersService.findById(senderId);
    const receiver = await this.usersService.findById(createMessageDto.receiverId);

    const message = this.messageRepository.create({
      text: createMessageDto.text,
      sender,
      receiver,
    });

    return this.messageRepository.save(message);
  }

  async getMessages(userId1: number, userId2: number) {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where(
        '(message.senderId = :userId1 AND message.receiverId = :userId2) OR ' +
        '(message.senderId = :userId2 AND message.receiverId = :userId1)',
        { userId1, userId2 }
      )
      .orderBy('message.timestamp', 'ASC')
      .getMany();
  }
} 