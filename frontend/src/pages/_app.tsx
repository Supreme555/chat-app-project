import { AuthProvider } from '@/hooks/useAuth.tsx';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { useViewportHeight } from '@/hooks/useViewportHeight';

export default function App({ Component, pageProps }: AppProps) {
  useViewportHeight();

  return (
    <AuthProvider>
      <ProtectedRoute>
        <Component {...pageProps} />
      </ProtectedRoute>
    </AuthProvider>
  );
} 