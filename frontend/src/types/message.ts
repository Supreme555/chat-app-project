export interface Message {
  id: number;
  text: string;
  sender: {
    id: number;
    username: string;
  };
  receiver: {
    id: number;
    username: string;
  };
  timestamp: string;
} 