'use client';

export default function HomePage() {
  const downloaders = [
    {
      title: 'YouTube Downloader',
      description: 'Download videos from YouTube in HD quality with audio',
      icon: '📺',
      link: '/youtube',
    },
    {
      title: 'Instagram Downloader',
      description: 'Download Instagram videos, reels, and photos easily',
      icon: '📸',
      link: '/instagram',
    },
    {
      title: 'Facebook Downloader',
      description: 'Save Facebook videos and Watch content to your device',
      icon: '👍',
      link: '/facebook',
    },
    {
      title: 'TikTok Downloader',
      description: 'Download TikTok videos without watermark in HD',
      icon: '🎵',
      link: '/tiktok',
    },
  ];

  const converters = [
    {
      title: 'Video Converter',
      description: 'Convert videos between formats: MP4, AVI, MKV, WebM',
      icon: '🎬',
      link: '/tools/video-converter',
    },
    {
      title: 'Audio Converter',
      description: 'Convert audio files: MP3, WAV, AAC, FLAC, OGG',
      icon: '🎧',
      link: '/tools/audio-converter',
    },
    {
      title: 'Image Converter',
      description: 'Convert & resize images: JPG, PNG, WebP, AVIF, GIF',
      icon: '🖼️',
      link: '/tools/image-converter',
    },
    {
      title: 'PDF to Word',
      description: 'Convert PDF documents to editable Word files',
      icon: '📄',
      link: '/tools/pdf-to-word',
    },
    {
      title: 'Word to PDF',
      description: 'Convert Word documents to professional PDF files',
      icon: '📝',
      link: '/tools/word-to-pdf',
    },
  ];

  const imageTools = [
    {
      title: 'Image Resizer',
      description: 'Resize images to custom dimensions while maintaining quality',
      icon: '📏',
      link: '/tools/image-resizer',
    },
    {
      title: 'Image Compressor',
      description: 'Reduce image file size with adjustable quality settings',
      icon: '🗜️',
      link: '/tools/image-compressor',
    },
    {
      title: 'Thumbnail Creator',
      description: 'Create small preview images perfect for websites',
      icon: '🖼️',
      link: '/tools/thumbnail-creator',
    },
  ];

  const pdfTools = [
    {
      title: 'PDF Merger',
      description: 'Combine multiple PDF files into a single document',
      icon: '📚',
      link: '/tools/pdf-merger',
    },
    {
      title: 'PDF Splitter',
      description: 'Split multi-page PDFs into individual page files',
      icon: '✂️',
      link: '/tools/pdf-splitter',
    },
  ];

  const utilityTools = [
    {
      title: 'QR Code Generator',
      description: 'Create QR codes from text, URLs, or data',
      icon: '📱',
      link: '/tools/qr-generator',
    },
    {
      title: 'Hash Generator',
      description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes',
      icon: '🔐',
      link: '/tools/hash-generator',
    },
    {
      title: 'Text Formatter',
      description: 'Transform text case and format easily',
      icon: '📝',
      link: '/tools/text-formatter',
    },
    {
      title: 'Color Palette',
      description: 'Extract dominant colors from images',
      icon: '🎨',
      link: '/tools/color-palette',
    },
    {
      title: 'Favicon Generator',
      description: 'Create multi-size .ico favicons for websites',
      icon: '🌐',
      link: '/tools/favicon-generator',
    },
  ];

  const mediaTools = [
    {
      title: 'Video Trimmer',
      description: 'Cut and trim video sections precisely',
      icon: '✂️',
      link: '/tools/video-trimmer',
    },
    {
      title: 'Watermark Tool',
      description: 'Add text watermarks to protect images',
      icon: '💧',
      link: '/tools/watermark',
    },
    {
      title: 'Background Remover',
      description: 'Remove backgrounds from images automatically',
      icon: '🖌️',
      link: '/tools/background-remover',
    },
    {
      title: 'Screenshot Tool',
      description: 'Capture screenshots of any website',
      icon: '📸',
      link: '/tools/screenshot',
    },
    {
      title: 'Text to Speech',
      description: 'Convert text to natural-sounding audio',
      icon: '🔊',
      link: '/tools/text-to-speech',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section with SEO Content */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Free Online Tools for Everyone
          </h1>
          <p className="text-2xl text-gray-700 mb-4 font-semibold">
            29+ Professional Tools - No Installation Required
          </p>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
            Download videos from YouTube, Instagram, Facebook & TikTok. Convert files, edit images,
            manipulate PDFs, and use powerful utility tools. All free and easy to use in your
            browser.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              ✓ 100% Free
            </span>
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              ✓ No Registration
            </span>
            <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
              ✓ Fast & Secure
            </span>
            <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
              ✓ Works on Any Device
            </span>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-center">All Tools & Downloaders</h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Download videos from any platform, convert media files, and use powerful document tools. 
          All tools work online with no software installation required.
        </p>

        {/* Downloaders Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">📥 Video Downloaders</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {downloaders.map((tool, index) => (
              <a
                key={index}
                href={tool.link}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform cursor-pointer"
              >
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Converters Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">🔄 File Converters</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {converters.map((tool, index) => (
              <a
                key={index}
                href={tool.link}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform cursor-pointer"
              >
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Image Tools Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">🖼️ Image Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageTools.map((tool, index) => (
              <a
                key={index}
                href={tool.link}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform cursor-pointer"
              >
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* PDF Tools Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">📄 PDF Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfTools.map((tool, index) => (
              <a
                key={index}
                href={tool.link}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform cursor-pointer"
              >
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Utility Tools Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">🔧 Utility Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {utilityTools.map((tool, index) => (
              <a
                key={index}
                href={tool.link}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform cursor-pointer"
              >
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Media Tools Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">🎥 Media Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaTools.map((tool, index) => (
              <a
                key={index}
                href={tool.link}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform cursor-pointer"
              >
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="mb-12 bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-lg border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Why Choose ToolsHub for Your Online Tool Needs?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                🎬 Best Video Downloader Tool
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Download videos from YouTube, Instagram, Facebook, and TikTok in high quality. Our
                video downloader supports HD, Full HD, and 4K resolution downloads. Save videos
                with audio in MP4 format or extract audio as MP3. Fast, free, and reliable video
                downloading service with no registration required.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-purple-600">
                🔄 Powerful File Conversion Tools
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Convert videos, audio, images, and documents between any format. Our converters
                support MP4, AVI, MKV, WebM for videos; MP3, WAV, AAC, FLAC for audio; JPG, PNG,
                WebP for images; and PDF to Word, Word to PDF for documents. Professional quality
                conversions in seconds.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-green-600">
                🖼️ Advanced Image Editing Tools
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Resize images to any dimension, compress images to reduce file size, create
                thumbnails for websites, remove backgrounds, add watermarks, and extract color
                palettes. All image tools preserve quality while optimizing for web and social media
                use.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-orange-600">
                📄 Complete PDF Solution
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Merge multiple PDF files into one, split PDF pages, convert PDF to Word documents,
                and convert Word to PDF. Our PDF tools are perfect for students, professionals, and
                anyone working with documents. Fast processing with secure file handling.
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold mb-3">✨ Key Features</h3>
            <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>100% free online tools - no hidden costs</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>No software installation or downloads needed</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Works on desktop, mobile, and tablet devices</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Secure processing - files auto-deleted after use</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Fast processing with high-quality results</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>No registration required for basic tools</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Support for all major file formats</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Regular updates with new features and tools</span>
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">
                Is ToolsHub really free to use?
              </h3>
              <p className="text-gray-700">
                Yes! ToolsHub offers all core tools completely free with no hidden costs. We also
                offer premium plans with advanced features like batch processing, faster speeds, and
                unlimited usage for power users.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">
                Do I need to install any software?
              </h3>
              <p className="text-gray-700">
                No installation required! All tools work directly in your web browser. Simply visit
                our website, select your tool, and start using it immediately on any device.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">
                Is it safe to use your tools? What about my privacy?
              </h3>
              <p className="text-gray-700">
                Your privacy and security are our top priorities. All files are processed securely
                using SSL encryption. Files are automatically deleted from our servers after
                processing. We never store or share your content.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">
                What video platforms do you support for downloading?
              </h3>
              <p className="text-gray-700">
                Our video downloader supports YouTube, Instagram, Facebook, TikTok, and many other
                platforms. You can download videos in various qualities including HD, Full HD, and
                4K where available.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">
                What file formats do your converters support?
              </h3>
              <p className="text-gray-700">
                We support all major formats: MP4, AVI, MKV, WebM for video; MP3, WAV, AAC, FLAC for
                audio; JPG, PNG, WebP, AVIF for images; and PDF/Word for documents. New formats are
                added regularly based on user requests.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-3">Need More Power?</h2>
          <p className="text-gray-700 mb-4">
            Upgrade to Premium for unlimited conversions, faster speeds, and access to advanced
            features like batch processing and priority support.
          </p>
          <a
            href="/pricing"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Pricing Plans
          </a>
        </div>
      </div>
    </div>
  );
}
