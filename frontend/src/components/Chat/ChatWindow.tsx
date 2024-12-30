import { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@/types/message';
import { User } from '@/types/user';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ChatWindowProps {
  selectedUser: User | null;
}

export const ChatWindow = ({ selectedUser }: ChatWindowProps) => {
  const { socket } = useSocket();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Загрузка истории сообщений
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !token) return;

      try {
        const response = await axios.get(`${API_URL}/api/chat/messages`, {
          headers: { 
            Authorization: token,
          },
          params: {
            userId: selectedUser.id
          }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
  }, [selectedUser, token]);

  // Подписка на новые сообщения
  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message: Message) => {
      // Добавляем сообщение только если оно относится к текущему чату
      if (
        (message.sender.id === user?.id && message.receiver.id === selectedUser?.id) ||
        (message.sender.id === selectedUser?.id && message.receiver.id === user?.id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, user, selectedUser]);

  // Автопрокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !newMessage.trim() || !selectedUser) return;

    try {
      await axios.post(`${API_URL}/api/chat/messages`, {
        text: newMessage,
        receiverId: selectedUser.id
      }, {
        headers: { Authorization: token }
      });

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  useEffect(() => {
    const handleOffline = () => {
      // Показать уведомление о потере соединения
    };

    const handleOnline = () => {
      // Переподключиться к чату
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b p-4">
        <h2 className="font-semibold">{selectedUser.username}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender.id === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender.id === user?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-75 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}; 