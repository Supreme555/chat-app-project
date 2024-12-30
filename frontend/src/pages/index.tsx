import { LoginForm } from '@/components/Auth/LoginForm';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Login</h2>
        <LoginForm />
        <p className="text-center">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
} 