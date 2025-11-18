'use client';

export default function ToolsPage() {
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
