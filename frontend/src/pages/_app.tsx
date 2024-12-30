import { AuthProvider } from '@/hooks/useAuth.tsx';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Component {...pageProps} />
      </ProtectedRoute>
    </AuthProvider>
  );
} 