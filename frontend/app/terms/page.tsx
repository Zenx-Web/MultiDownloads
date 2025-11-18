import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions - ToolsHub',
  description:
    'Read our terms and conditions to understand the rules and regulations for using ToolsHub services.',
};

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms and Conditions</h1>
        <p className="text-gray-600 mb-8">Last Updated: November 18, 2025</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using ToolsHub ("Service", "we", "our", or "us"), you agree to be
              bound by these Terms and Conditions ("Terms"). If you disagree with any part of these
              terms, you may not access the Service.
            </p>
            <p className="text-gray-700 mb-4">
              These Terms apply to all visitors, users, and others who access or use the Service.
              Please read these Terms carefully before using our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
            <p className="text-gray-700 mb-4">
              ToolsHub provides a comprehensive suite of online tools including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Video downloading services from various platforms (YouTube, Instagram, Facebook, TikTok)</li>
              <li>File format conversion tools (video, audio, image, document)</li>
              <li>Image editing and optimization tools</li>
              <li>PDF manipulation tools (merge, split, convert)</li>
              <li>Utility tools (QR code generator, hash generator, text formatter, etc.)</li>
              <li>Media processing tools (video trimmer, watermark, background remover, etc.)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify, suspend, or discontinue any part of our Service at any
              time without prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
            <p className="text-gray-700 mb-4">
              To access certain features of our Service, you may be required to create an account.
              You must provide accurate, complete, and current information during registration.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">3.2 Account Security</h3>
            <p className="text-gray-700 mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and
              for all activities that occur under your account. You must immediately notify us of any
              unauthorized use of your account.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">3.3 Account Termination</h3>
            <p className="text-gray-700 mb-4">
              We reserve the right to terminate or suspend your account at our sole discretion,
              without notice, for conduct that we believe violates these Terms or is harmful to other
              users, us, or third parties, or for any other reason.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
            <p className="text-gray-700 mb-4">You agree NOT to use the Service to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Download or distribute copyrighted content without proper authorization</li>
              <li>Violate any local, state, national, or international law</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Upload or transmit viruses, malware, or any malicious code</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems (bots, scrapers) without permission</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Engage in any fraudulent or deceptive practices</li>
              <li>Use the Service for commercial purposes without a premium subscription</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
            <h3 className="text-xl font-semibold mb-3">5.1 Our Content</h3>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are owned by ToolsHub
              and are protected by international copyright, trademark, patent, trade secret, and other
              intellectual property laws.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">5.2 User Content</h3>
            <p className="text-gray-700 mb-4">
              You retain all rights to any content you upload or process through our Service. By
              using our Service, you grant us a limited license to process your content solely for
              the purpose of providing the requested service. We do not claim ownership of your
              content.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">5.3 Copyright Infringement</h3>
            <p className="text-gray-700 mb-4">
              We respect the intellectual property rights of others. If you believe that your
              copyrighted work has been copied in a way that constitutes copyright infringement,
              please contact us with detailed information including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Description of the copyrighted work</li>
              <li>Location of the infringing material</li>
              <li>Your contact information</li>
              <li>A statement of good faith belief</li>
              <li>Your signature (physical or electronic)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Content and Copyright Notice</h2>
            <p className="text-gray-700 mb-4">
              <strong>Important:</strong> You are solely responsible for ensuring that you have the
              legal right to download, convert, or process any content using our Service. We do not
              authorize or condone the downloading of copyrighted content without proper
              authorization from the copyright holder.
            </p>
            <p className="text-gray-700 mb-4">
              Our Service is intended for downloading and converting content that you own, have
              created yourself, or have explicit permission to use. Downloading copyrighted material
              without permission may violate copyright laws in your jurisdiction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF
              ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
              <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
              <li>Warranties regarding the accuracy, reliability, or quality of any content or information</li>
              <li>Warranties that defects will be corrected</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Your use of the Service is at your sole risk. We do not warrant that the Service will
              meet your requirements or expectations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL TOOLSHUB, ITS DIRECTORS,
              EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                Any indirect, incidental, special, consequential, or punitive damages, including loss
                of profits, data, use, goodwill, or other intangible losses
              </li>
              <li>
                Any damages resulting from your access to or use of or inability to access or use the
                Service
              </li>
              <li>Any unauthorized access to or use of our servers and/or any personal information</li>
              <li>Any interruption or cessation of transmission to or from the Service</li>
              <li>Any bugs, viruses, or malicious code transmitted through the Service</li>
              <li>Any errors or omissions in any content or for any loss or damage incurred</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Our total liability shall not exceed the amount you paid us in the past twelve (12)
              months, or $100 USD, whichever is greater.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You agree to defend, indemnify, and hold harmless ToolsHub and its licensees,
              licensors, employees, contractors, agents, officers, and directors from and against any
              claims, damages, obligations, losses, liabilities, costs, or debt, and expenses
              (including attorney's fees) arising from:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Your use of and access to the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party right, including copyright, property, or privacy rights</li>
              <li>Any claim that your use caused damage to a third party</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Subscription and Payment Terms</h2>
            <h3 className="text-xl font-semibold mb-3">10.1 Free and Premium Services</h3>
            <p className="text-gray-700 mb-4">
              We offer both free and premium subscription plans. Premium features may include faster
              processing, higher quality outputs, batch processing, and unlimited usage.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">10.2 Billing</h3>
            <p className="text-gray-700 mb-4">
              Premium subscriptions are billed in advance on a recurring basis (monthly or annually).
              You will be charged automatically at the beginning of each billing period.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">10.3 Cancellation and Refunds</h3>
            <p className="text-gray-700 mb-4">
              You may cancel your subscription at any time. Cancellation will take effect at the end
              of the current billing period. We do not offer refunds for partial months or unused
              portions of your subscription, except as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and
              protect your personal information. By using the Service, you consent to our data
              practices as described in our{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Third-Party Links and Services</h2>
            <p className="text-gray-700 mb-4">
              Our Service may contain links to third-party websites or services that are not owned or
              controlled by ToolsHub. We have no control over and assume no responsibility for the
              content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="text-gray-700 mb-4">
              We strongly advise you to read the terms and conditions and privacy policies of any
              third-party websites or services that you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Modifications to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify or replace these Terms at any time at our sole
              discretion. We will provide notice of any material changes by posting the new Terms on
              this page and updating the "Last Updated" date.
            </p>
            <p className="text-gray-700 mb-4">
              Your continued use of the Service after any modifications indicates your acceptance of
              the new Terms. If you do not agree to the modified Terms, you must stop using the
              Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Governing Law and Dispute Resolution</h2>
            <h3 className="text-xl font-semibold mb-3">14.1 Governing Law</h3>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the
              jurisdiction in which ToolsHub operates, without regard to its conflict of law
              provisions.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">14.2 Dispute Resolution</h3>
            <p className="text-gray-700 mb-4">
              Any disputes arising out of or relating to these Terms or the Service shall be resolved
              through binding arbitration, except that either party may seek injunctive or other
              equitable relief in court to prevent infringement of intellectual property rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Severability</h2>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is held to be invalid or unenforceable, such provision
              shall be struck and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">16. Entire Agreement</h2>
            <p className="text-gray-700 mb-4">
              These Terms, together with our Privacy Policy, constitute the entire agreement between
              you and ToolsHub regarding the use of the Service and supersede all prior agreements
              and understandings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">17. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@toolshub.com" className="text-blue-600 hover:underline">
                  legal@toolshub.com
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
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Questions About Our Terms?</h3>
          <p className="text-gray-700 mb-4">
            Our team is here to help clarify any questions you may have about our terms and
            conditions.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
