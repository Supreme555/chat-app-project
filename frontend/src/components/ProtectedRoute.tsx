import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Не делаем редирект во время загрузки

    const isAuthPage = router.pathname.startsWith('/auth/');
    
    if (!isAuthenticated && !isAuthPage) {
      router.push('/auth/login');
    } else if (isAuthenticated && isAuthPage) {
      router.push('/chat');
    }
  }, [isAuthenticated, router.pathname, loading]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
} 