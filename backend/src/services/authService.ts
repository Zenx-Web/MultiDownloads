import { supabase, supabaseAdmin } from '../config/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: string;
}

/**
 * Sign up a new user
 */
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  const { email, password, fullName } = data;

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  return { user: authData.user, session: authData.session };
};

/**
 * Sign in an existing user
 */
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  const { email, password } = data;

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  return { user: authData.user, session: authData.session };
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<{ error?: string }> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return {};
};

/**
 * Get the current user session
 */
export const getSession = async (): Promise<{ session: Session | null; error?: string }> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return { session: null, error: error.message };
  }

  return { session: data.session };
};

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (userId: string): Promise<{ user: User | null; error?: string }> => {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user };
};

/**
 * Verify JWT token and get user
 */
export const verifyToken = async (token: string): Promise<{ user: User | null; error?: string }> => {
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user };
};

/**
 * Reset password via email
 */
export const resetPassword = async (email: string): Promise<{ error?: string }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {};
};

/**
 * Update user password
 */
export const updatePassword = async (newPassword: string): Promise<{ error?: string }> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return {};
};
