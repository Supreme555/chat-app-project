import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  useViewportHeight();

  return (
    <AuthProvider>
      <ProtectedRoute>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </ProtectedRoute>
    </AuthProvider>
  );
} 