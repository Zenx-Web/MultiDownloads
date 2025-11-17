'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            MultiDownloader
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                Platforms
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg mt-0 py-2 w-48 z-50 border border-gray-100">
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
            <Link href="/tools" className="text-gray-700 hover:text-blue-600 transition-colors">
              Tools
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 text-sm hidden md:inline">
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </>
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
          <button className="md:hidden text-gray-700">
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
