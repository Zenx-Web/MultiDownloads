import SignupForm from '@/components/SignupForm';

export const metadata = {
  title: 'Sign Up - MultiDownloader',
  description: 'Create your MultiDownloader account',
};

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
