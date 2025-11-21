'use client';

import { useState, useEffect } from 'react';

interface CookieConsentProps {
  onAccept: () => void;
}

export default function CookieConsent({ onAccept }: CookieConsentProps) {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    // Store consent
    localStorage.setItem('cookieConsent', 'accepted');
    
    // Pass to parent
    onAccept();
    setShowConsent(false);
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
              Cookie Consent Required
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              We use cookies to enhance your experience and enable site functionality.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
              <p className="text-xs text-gray-700 mb-2">
                <strong>What we use cookies for:</strong>
              </p>
              <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                <li>Remember your preferences</li>
                <li>Track download progress</li>
                <li>Enable essential site functionality</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Accept & Continue
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          You can change this preference anytime in settings
        </p>
      </div>
    </div>
  );
}
