import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined' || !token) return;

    try {
      const newSocket = io(API_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        toast.success('Connected to chat');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        toast.error('Disconnected from chat');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        toast.error('Connection error. Trying to reconnect...');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } catch (error) {
      console.error('Socket initialization error:', error);
      toast.error('Failed to initialize chat connection');
    }
  }, [token]);

  return { socket, isConnected };
}; 