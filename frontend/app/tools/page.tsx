'use client';

export default function ToolsPage() {
  const tools = [
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
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">All Tools & Downloaders</h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Download videos from any platform and convert media files between formats. 
          All tools work online with no software installation required.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <a
              key={index}
              href={tool.link}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform cursor-pointer"
            >
              <div className="text-5xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
              <p className="text-gray-600">{tool.description}</p>
            </a>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-3">Need More Power?</h2>
          <p className="text-gray-700 mb-4">
            Upgrade to Premium for unlimited downloads, faster speeds, and access to advanced
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
