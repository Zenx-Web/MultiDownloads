'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';

const getDisplayName = (email?: string | null, metadata?: Record<string, any>) => {
  const candidate = metadata?.full_name || metadata?.name || metadata?.user_name || metadata?.preferred_username;
  if (candidate) return candidate as string;
  if (email) {
    return email.split('@')[0];
  }
  return 'Account';
};

const getAvatarUrl = (metadata?: Record<string, any>) => {
  return (
    (metadata?.avatar_url as string | undefined) ||
    (metadata?.picture as string | undefined) ||
    (metadata?.image as string | undefined) ||
    ''
  );
};

const getInitials = (name: string) => {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
};

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { plan, downloadsUsedToday, isLoading: subscriptionLoading } = useSubscription();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const metadata = user
    ? ({ ...(user.user_metadata || {}), ...(user.app_metadata || {}) } as Record<string, any>)
    : null;
  const displayName = user ? getDisplayName(user.email, metadata || undefined) : '';
  const avatarUrl = user ? getAvatarUrl(metadata || undefined) : '';
  const downloadsSummary = subscriptionLoading
    ? 'Syncing usage...'
    : plan.dailyLimit === null
      ? 'Unlimited downloads'
      : `${downloadsUsedToday}/${plan.dailyLimit} downloads today`;
  const priceLabel = subscriptionLoading ? '₹—/month' : `₹${plan.priceMonthly}/month`;

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700">
            ToolsHub
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium py-2">
                Downloaders
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 top-full pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="bg-white shadow-lg rounded-lg py-2 w-48 border border-gray-100">
                  <Link href="/youtube" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                    📺 YouTube
                  </Link>
                  <Link href="/instagram" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                    📸 Instagram
                  </Link>
                  <Link href="/facebook" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    👍 Facebook
                  </Link>
                  <Link href="/tiktok" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    🎵 TikTok
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 transition-colors flex items-center font-medium py-2">
                Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 top-full pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="bg-white shadow-lg rounded-lg py-2 w-56 border border-gray-100">
                  <Link href="/tools" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold">
                    🔧 All Tools
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link href="/tools/video-converter" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors text-sm">
                    🎬 Video Converter
                  </Link>
                  <Link href="/tools/pdf-to-word" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors text-sm">
                    📄 PDF to Word
                  </Link>
                  <Link href="/tools/image-resizer" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-sm">
                    📏 Image Resizer
                  </Link>
                  <Link href="/tools/qr-generator" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm">
                    📱 QR Generator
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contact
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm transition hover:border-blue-200"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      getInitials(displayName) || 'U'
                    )}
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900">
                      {displayName}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {subscriptionLoading ? (
                        <span className="inline-flex h-3 w-16 animate-pulse rounded bg-gray-200" aria-hidden="true" />
                      ) : (
                        plan.label
                      )}
                    </span>
                  </div>
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`absolute right-0 mt-3 w-72 rounded-2xl border border-gray-100 bg-white shadow-2xl transition-all duration-200 ${
                    profileMenuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                  }`}
                >
                  <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        getInitials(displayName) || 'U'
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="px-4 py-4 text-sm text-gray-600 space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Plan</span>
                      <span className="font-semibold capitalize">
                        {subscriptionLoading ? (
                          <span className="inline-flex h-3 w-20 animate-pulse rounded bg-gray-200" aria-hidden="true" />
                        ) : (
                          plan.label
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Price</span>
                      <span className="font-semibold">
                        {subscriptionLoading ? (
                          <span className="inline-flex h-3 w-24 animate-pulse rounded bg-gray-200" aria-hidden="true" />
                        ) : (
                          priceLabel
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      <span className="font-semibold">
                        {subscriptionLoading ? (
                          <span className="inline-flex h-3 w-28 animate-pulse rounded bg-gray-200" aria-hidden="true" />
                        ) : (
                          downloadsSummary
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100">
                    <button
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        signOut();
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/youtube" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
              YouTube Downloader
            </Link>
            <Link href="/instagram" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
              Instagram Downloader
            </Link>
            <Link href="/tools" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
              All Tools
            </Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Link href="/pricing" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            {user ? (
              <>
                <div className="mt-4 rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <div className="mt-3 space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Plan</span>
                      <span className="font-semibold capitalize">
                        {subscriptionLoading ? (
                          <span className="inline-flex h-3 w-16 animate-pulse rounded bg-gray-200" aria-hidden="true" />
                        ) : (
                          plan.label
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price</span>
                      <span className="font-semibold">
                        {subscriptionLoading ? (
                          <span className="inline-flex h-3 w-20 animate-pulse rounded bg-gray-200" aria-hidden="true" />
                        ) : (
                          priceLabel
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className="font-semibold">
                        {subscriptionLoading ? (
                          <span className="inline-flex h-3 w-28 animate-pulse rounded bg-gray-200" aria-hidden="true" />
                        ) : (
                          downloadsSummary
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="mt-3 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
}
