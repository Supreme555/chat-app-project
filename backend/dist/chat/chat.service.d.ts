import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from '../users/users.service';
export declare class ChatService {
    private messagesRepository;
    private usersService;
    constructor(messagesRepository: Repository<Message>, usersService: UsersService);
    createMessage(createMessageDto: CreateMessageDto, senderId: number): Promise<Message>;
    getMessageHistory(userId: number): Promise<Message[]>;
}
