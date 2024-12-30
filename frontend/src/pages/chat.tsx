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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      
      if (currentUser) {
        const filteredUsers = response.data.filter(
          (user: User) => user.id !== currentUser.id
        );
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
      fetchUsers();
    }
  }, [isAuthenticated, token, currentUser]);

  const handleBackToUsers = () => {
    setSelectedUser(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
        {isMobile ? (
          selectedUser ? (
            <div className="flex flex-col h-full">
              <div className="bg-white px-4 py-2 flex items-center border-b">
                <button 
                  onClick={handleBackToUsers}
                  className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <div className="font-medium">{selectedUser.username}</div>
                  <div className="text-sm text-gray-500">{selectedUser.email}</div>
                </div>
              </div>
              <div className="flex-1">
                <ChatWindow selectedUser={selectedUser} />
              </div>
            </div>
          ) : (
            <UsersList
              users={users}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
            />
          )
        ) : (
          <>
            <UsersList
              users={users}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
            />
            <div className="flex-1">
              {selectedUser ? (
                <ChatWindow selectedUser={selectedUser} />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <p className="text-gray-500">Select a user to start chatting</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
} 