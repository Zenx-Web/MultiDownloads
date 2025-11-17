import { Request, Response } from 'express';
import * as authService from '../services/authService';

/**
 * Sign up a new user
 */
export const signUpHandler = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await authService.signUp({ email, password, fullName });

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'User created successfully. Please check your email to verify your account.',
      data: {
        user: result.user,
        session: result.session,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user',
    });
  }
};

/**
 * Sign in an existing user
 */
export const signInHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await authService.signIn({ email, password });

    if (result.error) {
      return res.status(401).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      data: {
        user: result.user,
        session: result.session,
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to sign in',
    });
  }
};

/**
 * Sign out the current user
 */
export const signOutHandler = async (req: Request, res: Response) => {
  try {
    const result = await authService.signOut();

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Signed out successfully',
    });
  } catch (error) {
    console.error('Sign out error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to sign out',
    });
  }
};

/**
 * Get current session
 */
export const getSessionHandler = async (req: Request, res: Response) => {
  try {
    const result = await authService.getSession();

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        session: result.session,
      },
    });
  } catch (error) {
    console.error('Get session error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get session',
    });
  }
};

/**
 * Request password reset
 */
export const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const result = await authService.resetPassword(email);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send reset email',
    });
  }
};

/**
 * Update password
 */
export const updatePasswordHandler = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required',
      });
    }

    const result = await authService.updatePassword(newPassword);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update password',
    });
  }
};

/**
 * Get current user profile
 */
export const getCurrentUserHandler = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // Set by auth middleware

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user',
    });
  }
};
