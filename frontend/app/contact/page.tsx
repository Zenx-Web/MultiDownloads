'use client';

import { useState } from 'react';
/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate form submission
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Have questions, feedback, or need support? We're here to help! Reach out to us using the
          form below or through our contact information.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 text-center">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="text-lg font-semibold mb-2">Email Support</h3>
            <a
              href="mailto:support@toolshub.com"
              className="text-blue-600 hover:underline"
            >
              support@toolshub.com
            </a>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm">
              Available Monday-Friday
              <br />
              9 AM - 6 PM EST
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100 text-center">
            <div className="text-4xl mb-3">❓</div>
            <h3 className="text-lg font-semibold mb-2">Help Center</h3>
            <a href="#" className="text-purple-600 hover:underline">
              Visit FAQ
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="partnership">Business Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  ✓ Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  ✗ Failed to send message. Please try again later.
                </div>
              )}
            </form>
          </div>

          {/* Additional Information */}
          <div>
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 mb-6">
              <h2 className="text-2xl font-semibold mb-6">Other Ways to Reach Us</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-3">📧</span> General Support
                  </h3>
                  <p className="text-gray-600 ml-11">
                    <a
                      href="mailto:support@toolshub.com"
                      className="text-blue-600 hover:underline"
                    >
                      support@toolshub.com
                    </a>
                    <br />
                    <span className="text-sm">For general inquiries and technical support</span>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-3">🔒</span> Privacy & Legal
                  </h3>
                  <p className="text-gray-600 ml-11">
                    <a
                      href="mailto:legal@toolshub.com"
                      className="text-blue-600 hover:underline"
                    >
                      legal@toolshub.com
                    </a>
                    <br />
                    <span className="text-sm">For privacy concerns and legal matters</span>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-3">💼</span> Business Inquiries
                  </h3>
                  <p className="text-gray-600 ml-11">
                    <a
                      href="mailto:business@toolshub.com"
                      className="text-blue-600 hover:underline"
                    >
                      business@toolshub.com
                    </a>
                    <br />
                    <span className="text-sm">For partnerships and collaborations</span>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-3">🐛</span> Report Issues
                  </h3>
                  <p className="text-gray-600 ml-11">
                    <a
                      href="mailto:bugs@toolshub.com"
                      className="text-blue-600 hover:underline"
                    >
                      bugs@toolshub.com
                    </a>
                    <br />
                    <span className="text-sm">Found a bug? Let us know!</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <p className="text-gray-700 mb-4">
                Stay updated with the latest features, tips, and announcements by following us on
                social media.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-white p-3 rounded-lg hover:bg-blue-50 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-white p-3 rounded-lg hover:bg-blue-50 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-white p-3 rounded-lg hover:bg-purple-50 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 2H8C4.5 2 2 4.5 2 8v8c0 3.5 2.5 6 6 6h8c3.5 0 6-2.5 6-6V8c0-3.5-2.5-6-6-6zm4 14c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v8z" />
                    <circle cx="12" cy="12" r="3.5" />
                    <circle cx="17.5" cy="6.5" r="1" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 flex items-center">
            <span className="text-2xl mr-3">⏱️</span> Response Time
          </h3>
          <p className="text-gray-700">
            We typically respond to all inquiries within 24-48 hours during business days. For urgent
            technical issues, premium users receive priority support with faster response times.
          </p>
        </div>
      </div>
    </div>
  );
}
