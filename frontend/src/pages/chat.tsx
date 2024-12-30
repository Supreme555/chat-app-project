import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ChatWindow } from '@/components/Chat/ChatWindow';
import { UsersList } from '@/components/Chat/UsersList';
import { useAuth } from '@/hooks/useAuth.tsx';
import { MainLayout } from '@/components/Layout/MainLayout';
import { User } from '@/types/user';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Chat() {
  const { isAuthenticated, token, user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const authToken = token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { 
          Authorization: authToken,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Auth Token:', authToken);
      console.log('Users response:', response.data);
      
      if (currentUser) {
        const filteredUsers = response.data.filter(
          (user: User) => user.id !== currentUser.id
        );
        setUsers(filteredUsers);
      } else {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      console.log('Error config:', error.config);
      console.log('Error response:', error.response);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (token && currentUser) {
      console.log('Current token:', token);
      fetchUsers();
    }
  }, [isAuthenticated, token, currentUser]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="h-full flex">
        {loading ? (
          <div className="w-full flex items-center justify-center">
            <div className="text-gray-500">Loading users...</div>
          </div>
        ) : (
          <>
            <UsersList
              users={users}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
            />
            <div className="flex-1">
              <ChatWindow selectedUser={selectedUser} />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
} 