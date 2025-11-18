import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ToolsHub',
  description:
    'Read our comprehensive privacy policy to understand how ToolsHub collects, uses, and protects your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: November 18, 2025</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to ToolsHub ("we," "our," or "us"). We are committed to protecting your
              privacy and ensuring the security of your personal information. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit
              our website and use our services.
            </p>
            <p className="text-gray-700 mb-4">
              By using ToolsHub, you agree to the collection and use of information in accordance
              with this policy. If you do not agree with our policies and practices, please do not
              use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 mb-4">
              When you create an account or contact us, we may collect:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Email address</li>
              <li>Name (if provided)</li>
              <li>Account credentials (encrypted)</li>
              <li>Payment information (processed securely through third-party providers)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Usage Information</h3>
            <p className="text-gray-700 mb-4">
              We automatically collect certain information when you use our services:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website addresses</li>
              <li>Tools and features used</li>
              <li>Download and conversion history</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.3 Cookies and Tracking Technologies</h3>
            <p className="text-gray-700 mb-4">
              We use cookies, web beacons, and similar tracking technologies to enhance your
              experience, analyze usage patterns, and deliver personalized content. You can control
              cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the collected information for:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Providing and improving our services</li>
              <li>Processing your requests and transactions</li>
              <li>Sending service-related notifications and updates</li>
              <li>Responding to your inquiries and support requests</li>
              <li>Analyzing usage patterns to improve user experience</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
              <li>Marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may
              share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                <strong>Service Providers:</strong> We work with trusted third-party service
                providers who assist us in operating our website, conducting business, or serving
                our users (e.g., payment processors, hosting providers, analytics services).
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, court order, or
                government regulation, or to protect our rights, property, or safety.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with any merger, sale of company
                assets, financing, or acquisition of all or a portion of our business.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share your information with your explicit
                consent for specific purposes.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your personal information
              from unauthorized access, disclosure, alteration, or destruction. These measures
              include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure password hashing and storage</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data backup procedures</li>
            </ul>
            <p className="text-gray-700 mb-4">
              However, no method of transmission over the Internet or electronic storage is 100%
              secure. While we strive to protect your information, we cannot guarantee absolute
              security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              Our website may contain links to third-party websites and services. We are not
              responsible for the privacy practices or content of these external sites. We encourage
              you to review the privacy policies of any third-party services you visit.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Google AdSense:</strong> We use Google AdSense to display advertisements. Google
              may use cookies to serve ads based on your prior visits to our website or other
              websites. You can opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Ads Settings
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                <strong>Access:</strong> Request access to the personal information we hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or incomplete information.
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal information (subject to
                legal obligations).
              </li>
              <li>
                <strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time.
              </li>
              <li>
                <strong>Data Portability:</strong> Request a copy of your data in a portable format.
              </li>
              <li>
                <strong>Cookie Management:</strong> Control cookie preferences through your browser
                settings.
              </li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@toolshub.com" className="text-blue-600 hover:underline">
                privacy@toolshub.com
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our services are not intended for children under the age of 13. We do not knowingly
              collect personal information from children under 13. If you are a parent or guardian
              and believe your child has provided us with personal information, please contact us,
              and we will delete such information from our systems.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and maintained on computers located outside of
              your state, province, country, or other governmental jurisdiction where data protection
              laws may differ. By using our services, you consent to such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes
              outlined in this Privacy Policy, unless a longer retention period is required or
              permitted by law. When we no longer need your information, we will securely delete or
              anonymize it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our
              practices or legal requirements. We will notify you of any material changes by posting
              the new Privacy Policy on this page and updating the "Last Updated" date. Your
              continued use of our services after such changes constitutes acceptance of the updated
              policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our
              data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@toolshub.com" className="text-blue-600 hover:underline">
                  privacy@toolshub.com
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Support:</strong>{' '}
                <a href="mailto:support@toolshub.com" className="text-blue-600 hover:underline">
                  support@toolshub.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Website:</strong>{' '}
                <a href="/contact" className="text-blue-600 hover:underline">
                  Contact Form
                </a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. GDPR Compliance (For EU Users)</h2>
            <p className="text-gray-700 mb-4">
              If you are located in the European Economic Area (EEA), you have additional rights
              under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Right to be informed about data collection and usage</li>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Rights related to automated decision-making and profiling</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Our lawful basis for processing your data includes consent, contract performance,
              legal obligations, and legitimate interests. You may withdraw consent at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. California Privacy Rights (CCPA)</h2>
            <p className="text-gray-700 mb-4">
              If you are a California resident, you have specific rights under the California
              Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Right to know what personal information is collected</li>
              <li>Right to know whether personal information is sold or disclosed</li>
              <li>Right to say no to the sale of personal information</li>
              <li>Right to access your personal information</li>
              <li>Right to equal service and price, even if you exercise your privacy rights</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information to third parties.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Need Help?</h3>
          <p className="text-gray-700 mb-4">
            If you have questions about our privacy practices or need assistance exercising your
            rights, our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
