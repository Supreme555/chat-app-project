import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from '../users/users.service';
export declare class ChatService {
    private messageRepository;
    private usersService;
    constructor(messageRepository: Repository<Message>, usersService: UsersService);
    createMessage(senderId: number, createMessageDto: CreateMessageDto): Promise<Message>;
    getMessages(userId1: number, userId2: number): Promise<Message[]>;
}
