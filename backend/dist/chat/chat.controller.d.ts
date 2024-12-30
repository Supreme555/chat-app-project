import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/entities/user.entity';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getMessages(user: User, userId: number): Promise<import("./entities/message.entity").Message[]>;
    createMessage(user: User, createMessageDto: CreateMessageDto): Promise<import("./entities/message.entity").Message>;
}
