import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const isValidRedirectPath = (value?: string | null) => {
  if (!value) return '/';
  if (!value.startsWith('/')) return '/';
  return value;
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextPath = isValidRedirectPath(requestUrl.searchParams.get('next'));

  const loginUrl = new URL('/login', requestUrl.origin);
  loginUrl.searchParams.set('redirectTo', nextPath);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!code) {
    loginUrl.searchParams.set('error', 'Missing authorization code');
    return NextResponse.redirect(loginUrl);
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    loginUrl.searchParams.set('error', 'Supabase environment variables missing');
    return NextResponse.redirect(loginUrl);
  }

  const redirectUrl = new URL(nextPath, requestUrl.origin);
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    loginUrl.searchParams.set('error', error.message);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
