'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const parseHashParams = () => {
  if (typeof window === 'undefined' || !window.location.hash) {
    return null;
  }

  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.substring(1)
    : window.location.hash;

  return new URLSearchParams(hash);
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    const supabase = createClient();

    const handleCallback = async () => {
      try {
        // 1. Handle implicit flow tokens returned in the URL hash
        const hashParams = parseHashParams();
        const accessToken = hashParams?.get('access_token');
        const refreshToken = hashParams?.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          if (typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname);
          }

          router.replace('/');
          router.refresh();
          return;
        }

        // 2. Handle errors returned as query params
        const errorDescription = searchParams.get('error_description');
        if (errorDescription) {
          setStatus('error');
          setMessage(decodeURIComponent(errorDescription));
          return;
        }

        // 3. Handle PKCE/code flow
        const code = searchParams.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }

          router.replace('/');
          router.refresh();
          return;
        }

        throw new Error('Authentication failed. Please try signing in again.');
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed.');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <div className="flex flex-col items-center text-center">
          {status === 'loading' ? (
            <>
              <div className="h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <h1 className="text-xl font-semibold text-gray-900">{message}</h1>
              <p className="text-sm text-gray-600 mt-2">Please wait while we finish signing you in.</p>
            </>
          ) : (
            <>
              <div className="text-red-500 text-4xl mb-2">⚠️</div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Google sign-in failed</h1>
              <p className="text-sm text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => router.replace('/login')}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Back to login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
