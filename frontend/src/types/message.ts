import { User } from './auth';

export interface Message {
  id: number | string;
  text: string;
  sender: User;
  receiver: User;
  timestamp: string;
} 