'use client';

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Choose the plan that works best for you
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <div className="text-4xl font-bold mb-6">
              $0<span className="text-lg text-gray-600">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>5 downloads per day</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Up to 720p quality</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Basic conversion tools</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>2 concurrent downloads</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">✗</span>
                <span className="text-gray-400">Ads supported</span>
              </li>
            </ul>

            <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              Current Plan
            </button>
          </div>

          {/* Premium Tier */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg shadow-xl p-8 border-2 border-blue-500 relative">
            <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
              POPULAR
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Premium</h2>
            <div className="text-4xl font-bold mb-6">
              $9.99<span className="text-lg opacity-80">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">✓</span>
                <span>Unlimited downloads</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">✓</span>
                <span>Up to 4K quality</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">✓</span>
                <span>Advanced conversion tools</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">✓</span>
                <span>10 concurrent downloads</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">✓</span>
                <span>No ads</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">✓</span>
                <span>Batch downloads</span>
              </li>
            </ul>

            <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Upgrade to Premium
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and other popular payment methods through
                our secure payment processor.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your premium subscription at any time. You'll continue to have
                access until the end of your billing period.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-2">Is there a free trial for Premium?</h3>
              <p className="text-gray-600">
                We offer a 7-day free trial for new Premium subscribers. No credit card required to
                start your trial.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-2">What platforms do you support?</h3>
              <p className="text-gray-600">
                We support YouTube, Instagram, Facebook, Pinterest, TikTok, Twitter, and many more
                platforms. Our list is constantly growing!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
