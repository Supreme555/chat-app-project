import { Message } from '../../chat/entities/message.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    username: string;
    sentMessages: Message[];
    receivedMessages: Message[];
}
