import { User } from '../../users/entities/user.entity';
export declare class Message {
    id: number;
    text: string;
    timestamp: Date;
    sender: User;
    receiver: User;
}
