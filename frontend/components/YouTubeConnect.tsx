'use client';

import { useYouTubeOAuth } from '@/contexts/YouTubeOAuthContext';

interface YouTubeConnectProps {
  compact?: boolean;
}

export default function YouTubeConnect({ compact = false }: YouTubeConnectProps) {
  const {
    isConfigured,
    isConnected,
    account,
    isLoading,
    error,
    connectYouTube,
    disconnectYouTube,
  } = useYouTubeOAuth();

  // Don't show anything if OAuth is not configured
  if (!isConfigured && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${compact ? 'text-sm' : ''}`}>
        <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full"></div>
        <span className="text-gray-500">Checking YouTube...</span>
      </div>
    );
  }

  if (isConnected && account) {
    return (
      <div className={`flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg ${compact ? 'p-2' : 'p-3'}`}>
        {account.picture && (
          <img 
            src={account.picture} 
            alt={account.name || 'YouTube account'} 
            className={`rounded-full ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}
          />
        )}
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-green-700 truncate ${compact ? 'text-sm' : ''}`}>
            {account.name || account.email || 'YouTube Connected'}
          </p>
          {!compact && account.email && account.name && (
            <p className="text-xs text-green-600 truncate">{account.email}</p>
          )}
        </div>
        <button
          onClick={disconnectYouTube}
          className={`text-gray-500 hover:text-red-600 transition-colors ${compact ? 'text-sm' : ''}`}
          title="Disconnect YouTube"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className={compact ? '' : 'space-y-2'}>
      <button
        onClick={connectYouTube}
        disabled={isLoading}
        className={`
          flex items-center justify-center gap-2 
          bg-red-600 hover:bg-red-700 text-white 
          rounded-lg transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 w-full'}
        `}
      >
        <svg className={compact ? 'w-4 h-4' : 'w-5 h-5'} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
        <span>{compact ? 'Connect' : 'Connect YouTube Account'}</span>
      </button>
      
      {error && (
        <p className={`text-red-500 ${compact ? 'text-xs' : 'text-sm'}`}>
          {error}
        </p>
      )}
      
      {!compact && (
        <p className="text-xs text-gray-500 text-center">
          Connect your YouTube account to bypass download restrictions
        </p>
      )}
    </div>
  );
}
