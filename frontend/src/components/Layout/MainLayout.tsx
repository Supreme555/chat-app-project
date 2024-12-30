import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      {user && (
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Chat App</h1>
            <div className="flex items-center gap-4">
              <span>{user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
      )}
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}; 