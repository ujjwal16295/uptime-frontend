"use client"
import React from 'react';
import { Shield, Eye, Database, Lock, Mail, Globe, UserCheck, Trash2 } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "overview",
      title: "1. Overview",
      icon: Shield,
      content: `**NapStopper** is committed to protecting your privacy. This Privacy Policy explains how **NapStopper** collects, uses, and protects your information when you use our uptime monitoring service.

**What NapStopper Does**: We monitor your web applications by sending HTTP requests every 10 minutes to keep them from going to sleep on free hosting platforms.`
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      icon: Database,
      content: `**2.1 Information You Provide to NapStopper**
• Email address (for account creation and login)
• URLs of applications you want to monitor
• Payment information (processed by third-party payment processors)

**2.2 Information NapStopper Automatically Collects**
• Email
• URLs
• Last logged in 

**2.3 Information NapStopper Does NOT Collect**
• We do NOT store the content or responses from your monitored applications
• We do NOT collect personal data beyond what's necessary for the NapStopper service
• We do NOT track your browsing activity outside the NapStopper platform`
    },
    {
      id: "how-we-use",
      title: "3. How NapStopper Uses Your Information",
      icon: Eye,
      content: `**3.1 NapStopper Service Delivery**
• Send monitoring requests to your registered URLs
• Provide you with NapStopper service statistics and notifications
• Process payments and manage your NapStopper account

**3.2 NapStopper Service Improvement**
• Analyze usage patterns to improve the NapStopper service
• Monitor NapStopper service performance and reliability
• Develop new NapStopper features based on user needs

**3.3 NapStopper Communication**
• Send important NapStopper service updates and notifications
• Respond to your NapStopper support requests
• Notify you about NapStopper account-related matters

**NapStopper Does NOT:**
• Sell your information to third parties
• Use your data for advertising purposes
• Share your URLs with anyone else`
    },
    {
      id: "data-sharing",
      title: "4. Information Sharing by NapStopper",
      icon: UserCheck,
      content: `**4.1 NapStopper Shares Information Only When:**
• **Payment Processing**: With payment processor Paddle to handle NapStopper transactions
• **Legal Requirements**: When required by law, court order, or legal process
• **Service Providers**: With trusted third-party services that help NapStopper operate (hosting, analytics)
• **Business Transfer**: In case of merger, acquisition, or sale of the NapStopper business

**4.2 NapStopper Never:**
• Sells your personal information
• Shares your monitored URLs with unauthorized parties
• Uses your data for marketing to third parties
• Provides access to your NapStopper account information to others`
    },
    {
      id: "data-security",
      title: "5. NapStopper Data Security",
      icon: Lock,
      content: `**5.1 NapStopper Security Measures**
• Encryption of data in transit and at rest
• Secure authentication systems for NapStopper
• Regular security audits and updates
• Limited access to personal information

**5.2 Your Responsibilities Using NapStopper**
• Ensure your monitored URLs don't expose sensitive information

**5.3 NapStopper Data Breach Policy**
• NapStopper will notify you promptly if a data breach affects your information
• NapStopper will take immediate steps to secure the breach and protect your data`
    },
    {
      id: "data-retention",
      title: "6. NapStopper Data Retention",
      icon: Database,
      content: `**NapStopper Data Retention Policy**
• You can request deletion of your NapStopper account and data at any time
• NapStopper will delete your information within 30 days of your request
• Some information may be retained as required by law`
    },
    {
      id: "your-rights",
      title: "7. Your Privacy Rights with NapStopper",
      icon: UserCheck,
      content: `**You Have the Right To:**
• **Access**: Request a copy of your personal information from NapStopper
• **Correction**: Update or correct inaccurate information in your NapStopper account
• **Deletion**: Request deletion of your NapStopper account and data
• **Portability**: Request your NapStopper data in a portable format
• **Withdraw Consent**: Stop using the NapStopper service at any time

**How to Exercise Your Rights with NapStopper:**
• Contact NapStopper through our support channels
• Most NapStopper account changes can be made through your account settings
• NapStopper will respond to requests within 30 days`
    },
  ];

  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h4 key={index} className="font-semibold text-gray-900 mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </h4>
        );
      }
      if (line.startsWith('• ')) {
        return (
          <li key={index} className="ml-4 mb-1 text-gray-700">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-gray-700 mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">NapStopper Privacy Policy</h1>
          </div>
          <p className="text-gray-600 text-lg">Last Updated: August 27, 2025</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Key Highlights */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <h2 className="text-2xl font-bold mb-4">NapStopper Privacy at a Glance</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <span>NapStopper collects minimal data: email and URLs only</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <span>NapStopper doesn't store your app responses or content</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <span>NapStopper never sells your information</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <span>You can delete your NapStopper data anytime</span>
              </div>
            </div>
          </div>

          {/* Privacy Sections */}
          <div className="p-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={section.id} className={`${index !== 0 ? 'border-t border-gray-200 pt-8' : ''} mb-8`}>
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <div className="ml-12">
                    {formatContent(section.content)}
                  </div>
                </div>
              );
            })}

            {/* Contact Section */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                8. Contact NapStopper
              </h3>
              <div className="ml-12 text-gray-700">
                <p className="mb-3">
                  If you have questions about this NapStopper Privacy Policy or want to exercise your privacy rights, please contact us:
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <ul className="space-y-2 text-green-700">
                    <li>• Through NapStopper support channels on the platform</li>
                    <li>• Email us at the contact information provided on the NapStopper website</li>
                    <li>• NapStopper will respond to privacy requests within 30 days</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Updates Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                9. Changes to This NapStopper Policy
              </h3>
              <div className="ml-12">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-700 mb-2">
                    NapStopper may update this Privacy Policy from time to time. When we do:
                  </p>
                  <ul className="text-purple-700 space-y-1 text-sm">
                    <li>• NapStopper will update the "Last Updated" date at the top</li>
                    <li>• NapStopper will notify you of significant changes via email</li>
                    <li>• Continued use of the NapStopper service means you accept the updated policy</li>
                    <li>• You can always find the current version on the NapStopper website</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold text-blue-800 mb-2">Your Privacy Matters to NapStopper</h3>
                <p className="text-blue-700 mb-4">
                  NapStopper is committed to protecting your privacy and being transparent about how we handle your data.
                </p>
                <div className="text-sm text-blue-600">
                  <p>Questions or concerns? Don't hesitate to reach out to the NapStopper team.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Back to NapStopper Home
          </button>
        </div>
      </div>
    </div>
  );
}