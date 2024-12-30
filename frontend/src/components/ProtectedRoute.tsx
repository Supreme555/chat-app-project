import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth.tsx';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Проверяем, что мы не на странице авторизации
    const isAuthPage = router.pathname.startsWith('/auth/');
    
    if (!isAuthenticated && !isAuthPage) {
      router.push('/auth/login');
    } else if (isAuthenticated && isAuthPage) {
      router.push('/chat');
    }
  }, [isAuthenticated, router.pathname]);

  return <>{children}</>;
} 