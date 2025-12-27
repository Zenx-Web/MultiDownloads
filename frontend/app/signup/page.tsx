import SignupForm from '@/components/SignupForm';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Create a Free ToolsHub Account',
  description: 'Sign up for ToolsHub to unlock unlimited downloads, faster conversions, and synced preferences across devices.',
  path: '/signup',
  keywords: ['toolshub signup', 'create toolshub account', 'register toolshub'],
});

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Join MultiDownloader</h1>
          <p className="text-gray-600">Start downloading and converting files for free</p>
        </div>
        
        <SignupForm />
      </div>
    </div>
  );
}
