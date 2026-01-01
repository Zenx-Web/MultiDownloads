'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface YouTubeAccount {
  connected: boolean;
  email?: string;
  name?: string;
  picture?: string;
  connectedAt?: number;
}

interface YouTubeOAuthContextType {
  // State
  isConfigured: boolean;
  isConnected: boolean;
  account: YouTubeAccount | null;
  sessionId: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  connectYouTube: () => Promise<void>;
  disconnectYouTube: () => Promise<void>;
  refreshConnection: () => Promise<void>;
}

const YouTubeOAuthContext = createContext<YouTubeOAuthContextType | null>(null);

/**
 * Generate or retrieve a persistent session ID
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('youtube_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('youtube_session_id', sessionId);
  }
  return sessionId;
}

export function YouTubeOAuthProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [account, setAccount] = useState<YouTubeAccount | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  // Check OAuth configuration and connection status
  const checkStatus = useCallback(async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if OAuth is configured
      const configResponse = await fetch(`${API_URL}/youtube-oauth/status`);
      const configData = await configResponse.json();
      setIsConfigured(configData.data?.configured || false);
      
      if (!configData.data?.configured) {
        setIsLoading(false);
        return;
      }
      
      // Check connection status
      const connectionResponse = await fetch(
        `${API_URL}/youtube-oauth/connection?sessionId=${encodeURIComponent(sessionId)}`
      );
      const connectionData = await connectionResponse.json();
      
      if (connectionData.success && connectionData.data) {
        setAccount(connectionData.data);
      } else {
        setAccount({ connected: false });
      }
    } catch (err) {
      console.error('[YouTubeOAuth] Error checking status:', err);
      setError('Failed to check YouTube connection status');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Check status on mount and when sessionId changes
  useEffect(() => {
    if (sessionId) {
      checkStatus();
    }
  }, [sessionId, checkStatus]);

  // Check for OAuth callback result
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const youtubeConnected = urlParams.get('youtube_connected');
    const oauthError = urlParams.get('oauth_error');
    
    if (youtubeConnected === 'true') {
      // OAuth successful, refresh status
      checkStatus();
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else if (oauthError) {
      setError(`YouTube connection failed: ${oauthError}`);
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [checkStatus]);

  // Connect YouTube account
  const connectYouTube = useCallback(async () => {
    if (!sessionId || !isConfigured) {
      setError('YouTube OAuth is not configured');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const currentUrl = window.location.href;
      const response = await fetch(
        `${API_URL}/youtube-oauth/auth-url?sessionId=${encodeURIComponent(sessionId)}&redirect=${encodeURIComponent(currentUrl)}`
      );
      const data = await response.json();
      
      if (data.success && data.data?.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.data.authUrl;
      } else {
        throw new Error(data.error || 'Failed to get auth URL');
      }
    } catch (err) {
      console.error('[YouTubeOAuth] Error connecting:', err);
      setError('Failed to start YouTube connection');
      setIsLoading(false);
    }
  }, [sessionId, isConfigured]);

  // Disconnect YouTube account
  const disconnectYouTube = useCallback(async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/youtube-oauth/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAccount({ connected: false });
      } else {
        throw new Error(data.error || 'Failed to disconnect');
      }
    } catch (err) {
      console.error('[YouTubeOAuth] Error disconnecting:', err);
      setError('Failed to disconnect YouTube account');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const value: YouTubeOAuthContextType = {
    isConfigured,
    isConnected: account?.connected || false,
    account,
    sessionId,
    isLoading,
    error,
    connectYouTube,
    disconnectYouTube,
    refreshConnection: checkStatus,
  };

  return (
    <YouTubeOAuthContext.Provider value={value}>
      {children}
    </YouTubeOAuthContext.Provider>
  );
}

export function useYouTubeOAuth() {
  const context = useContext(YouTubeOAuthContext);
  if (!context) {
    throw new Error('useYouTubeOAuth must be used within a YouTubeOAuthProvider');
  }
  return context;
}
