import { User } from '../../users/entities/user.entity';
export declare class Message {
    id: number;
    text: string;
    sender: User;
    receiver: User;
    timestamp: Date;
}
