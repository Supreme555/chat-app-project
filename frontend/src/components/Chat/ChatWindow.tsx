import { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth.tsx';
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
  const [isSending, setIsSending] = useState(false);
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

  // Подписка на новые сообщения через сокет
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      // Добавляем сообщение только если оно относится к текущему чату
      if (
        (message.sender.id === user?.id && message.receiver.id === selectedUser?.id) ||
        (message.sender.id === selectedUser?.id && message.receiver.id === user?.id)
      ) {
        setMessages((prev) => [...prev, message]);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, user, selectedUser]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !newMessage.trim() || !selectedUser || isSending) return;

    setIsSending(true);
    try {
      // Создаем временное сообщение для мгновенного отображения
      const tempMessage = {
        id: Date.now(), // временный ID
        text: newMessage,
        sender: user,
        receiver: selectedUser,
        timestamp: new Date().toISOString(),
      };

      // Добавляем сообщение в локальный state
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

      // Отправляем сообщение на сервер
      const response = await axios.post(
        `${API_URL}/api/chat/messages`,
        {
          text: newMessage,
          receiverId: selectedUser.id
        },
        {
          headers: { Authorization: token }
        }
      );

      // Заменяем временное сообщение на реальное
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === tempMessage.id ? response.data : msg
        )
      );

      // Эмитим событие через сокет
      socket.emit('sendMessage', response.data);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      // Удаляем временное сообщение в случае ошибки
      setMessages((prev) => prev.filter(msg => msg.id !== Date.now()));
    } finally {
      setIsSending(false);
    }
  };

  // Индикатор состояния соединения
  useEffect(() => {
    const handleOffline = () => {
      toast.error('You are offline. Messages will be sent when connection is restored.');
    };

    const handleOnline = () => {
      toast.success('Connection restored!');
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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-white font-medium">
                  {selectedUser?.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-medium text-gray-900">
                {selectedUser?.username}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedUser?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-y-auto px-4 py-6">
          <div className="space-y-6">
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const isSentByMe = message.sender.id === user?.id;
              const showAvatar = !isSentByMe;

              return (
                <div
                  key={message.id}
                  className={`flex items-end space-x-2 ${
                    isSentByMe ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {showAvatar && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-white text-sm">
                          {message.sender.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                  <div
                    className={`flex flex-col space-y-1 ${
                      isSentByMe ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2 max-w-sm break-words ${
                        isSentByMe
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={sendMessage} className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isSending}
              className="message-input"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              disabled={isSending}
              className={`send-button ${
                isSending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 