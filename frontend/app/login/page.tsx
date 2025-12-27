import LoginForm from '@/components/LoginForm';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Login | Access Your ToolsHub Account',
  description: 'Sign in to ToolsHub to sync downloads, manage premium features, and track your processing history.',
  path: '/login',
  keywords: ['toolshub login', 'sign in toolshub', 'account access'],
});

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Sign in to continue downloading and converting</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
