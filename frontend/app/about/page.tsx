/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - ToolsHub',
  description:
    'Learn about ToolsHub, our mission to provide free online tools for everyone, and the team behind the platform.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About ToolsHub
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Your trusted platform for free online tools and utilities
        </p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At ToolsHub, our mission is to democratize access to powerful online tools that make
              digital tasks easier, faster, and more efficient. We believe that everyone should have
              access to professional-grade utilities without the need for expensive software or
              technical expertise.
            </p>
            <p className="text-gray-700 mb-4">
              Whether you're a content creator, student, professional, or simply someone looking to
              accomplish everyday digital tasks, ToolsHub provides the tools you need—all in one
              convenient platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg border border-red-100">
                <div className="text-4xl mb-3">📥</div>
                <h3 className="text-xl font-semibold mb-2">Video Downloaders</h3>
                <p className="text-gray-700">
                  Download videos from YouTube, Instagram, Facebook, TikTok, and more platforms in
                  high quality with ease.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="text-xl font-semibold mb-2">File Converters</h3>
                <p className="text-gray-700">
                  Convert between video, audio, image, and document formats with our powerful
                  conversion tools.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
                <div className="text-4xl mb-3">🖼️</div>
                <h3 className="text-xl font-semibold mb-2">Image Tools</h3>
                <p className="text-gray-700">
                  Resize, compress, and create thumbnails with our comprehensive suite of image
                  editing tools.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
                <div className="text-4xl mb-3">📄</div>
                <h3 className="text-xl font-semibold mb-2">PDF Tools</h3>
                <p className="text-gray-700">
                  Merge, split, and convert PDF documents. Transform PDFs to Word and Word to PDF
                  seamlessly.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-100">
                <div className="text-4xl mb-3">🔧</div>
                <h3 className="text-xl font-semibold mb-2">Utility Tools</h3>
                <p className="text-gray-700">
                  Generate QR codes, create hashes, format text, extract color palettes, and create
                  favicons.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg border border-cyan-100">
                <div className="text-4xl mb-3">🎥</div>
                <h3 className="text-xl font-semibold mb-2">Media Tools</h3>
                <p className="text-gray-700">
                  Trim videos, add watermarks, remove backgrounds, capture screenshots, and convert
                  text to speech.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Why Choose ToolsHub?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-2xl mr-4">✅</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Completely Free to Use</h3>
                  <p className="text-gray-700">
                    Access our core tools at no cost. Premium features are available for power users
                    who need advanced functionality.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">🚀</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Fast and Reliable</h3>
                  <p className="text-gray-700">
                    Our tools are optimized for speed and reliability, processing your files quickly
                    without compromising quality.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">🔒</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Privacy and Security</h3>
                  <p className="text-gray-700">
                    Your files are processed securely and automatically deleted after processing. We
                    never store or share your content.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">💻</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">No Installation Required</h3>
                  <p className="text-gray-700">
                    All tools run in your browser. No downloads, no installations, no hassle. Works
                    on any device with an internet connection.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">🎯</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">User-Friendly Interface</h3>
                  <p className="text-gray-700">
                    Our intuitive design makes even complex tasks simple. No technical knowledge
                    required—just upload and go.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">🌍</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Always Available</h3>
                  <p className="text-gray-700">
                    Access our tools 24/7 from anywhere in the world. Cloud-based processing ensures
                    you're never limited by your device's capabilities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-gray-700 mb-4">
              We are committed to continuously improving and expanding our platform. Our development
              team works tirelessly to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Add new tools and features based on user feedback</li>
              <li>Improve processing speed and efficiency</li>
              <li>Enhance security and privacy measures</li>
              <li>Support more file formats and platforms</li>
              <li>Maintain the highest quality standards</li>
              <li>Provide excellent customer support</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-700 text-sm">
                  Making powerful tools available to everyone, regardless of technical expertise or
                  budget.
                </p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold mb-2">Innovation</h3>
                <p className="text-gray-700 text-sm">
                  Constantly evolving and adopting new technologies to provide cutting-edge
                  solutions.
                </p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="text-lg font-semibold mb-2">User-Centric</h3>
                <p className="text-gray-700 text-sm">
                  Listening to our users and building features that solve real problems and add
                  genuine value.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-gray-700 mb-4">
              ToolsHub is more than just a platform—it's a growing community of creators,
              professionals, and everyday users who share a passion for efficiency and quality. Join
              thousands of users who trust ToolsHub for their daily digital tasks.
            </p>
            <p className="text-gray-700 mb-6">
              Have questions, suggestions, or feedback? We'd love to hear from you. Your input helps
              us create better tools and improve your experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/contact"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/signup"
                className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Create Free Account
              </a>
            </div>
          </section>

          <section className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-100">
            <h2 className="text-2xl font-semibold mb-4">Our Stats</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">29+</div>
                <p className="text-gray-700">Free Tools</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">500K+</div>
                <p className="text-gray-700">Happy Users</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">2M+</div>
                <p className="text-gray-700">Files Processed</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">99.9%</div>
                <p className="text-gray-700">Uptime</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
          <p className="text-gray-700 mb-6">
            Explore our comprehensive suite of tools and discover how ToolsHub can simplify your
            digital workflow.
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Browse All Tools
          </a>
        </div>
      </div>
    </div>
  );
}
