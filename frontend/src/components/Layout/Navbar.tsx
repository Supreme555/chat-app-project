import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-white font-bold text-xl">
              Chat App
            </div>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <span className="text-white mr-4">
                  Welcome, {user?.username}
                </span>
                <Link 
                  href="/chat" 
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
                >
                  Chat
                </Link>
                <button
                  onClick={logout}
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md ml-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md ml-4"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 