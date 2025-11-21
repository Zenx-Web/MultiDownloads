'use client';

import { useState, useEffect } from 'react';

interface CookieConsentProps {
  onAccept: (cookies: string) => void;
}

export default function CookieConsent({ onAccept }: CookieConsentProps) {
  const [showConsent, setShowConsent] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const extractCookies = () => {
    try {
      // Get all cookies from the current domain
      const cookies = document.cookie;
      
      // Convert to Netscape format
      const netscapeCookies = cookies.split(';').map(cookie => {
        const [name, value] = cookie.trim().split('=');
        const domain = '.youtube.com';
        const path = '/';
        const secure = 'TRUE';
        const expiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60); // 1 year
        return `${domain}\tTRUE\t${path}\t${secure}\t${expiry}\t${name}\t${value}`;
      }).join('\n');

      return netscapeCookies;
    } catch (error) {
      console.error('Failed to extract cookies:', error);
      return '';
    }
  };

  const handleAccept = () => {
    setIsExtracting(true);
    
    // Extract cookies
    const cookies = extractCookies();
    
    // Store consent
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('youtubeCookies', cookies);
    
    // Pass cookies to parent
    onAccept(cookies);
    
    setTimeout(() => {
      setShowConsent(false);
      setIsExtracting(false);
    }, 500);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-start mb-4">
          <div className="text-3xl mr-3">🍪</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              YouTube Download Permission
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              To download YouTube videos, we need to use your browser's YouTube cookies. 
              This helps bypass YouTube's bot detection.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
              <p className="text-xs text-gray-700">
                <strong>What happens:</strong>
              </p>
              <ul className="text-xs text-gray-600 mt-1 space-y-1 ml-4 list-disc">
                <li>We'll read your YouTube cookies from this browser session</li>
                <li>Cookies are sent securely with your download requests</li>
                <li>Cookies are NOT stored on our servers</li>
                <li>Only used temporarily for your downloads</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            disabled={isExtracting}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={isExtracting}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isExtracting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Extracting...
              </span>
            ) : (
              'Accept & Continue'
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          You can change this preference anytime in settings
        </p>
      </div>
    </div>
  );
}
