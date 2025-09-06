"use client"
import React from 'react';
import { FileText, Shield, CreditCard, Users, AlertTriangle, Clock } from 'lucide-react';

export default function TermsOfService() {
  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: FileText,
      content: `By accessing and using **NapStopper** uptime monitoring service ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these terms, please do not use the NapStopper Service.`
    },
    {
      id: "service",
      title: "2. NapStopper Service Description", 
      icon: Clock,
      content: `The **NapStopper** Service provides uptime monitoring for web applications by:
• Sending HTTP requests to your registered URLs every 10 minutes
• Preventing free-tier hosting platforms from putting your applications to sleep
• Supporting up to 3 URLs for free NapStopper accounts
• Offering paid NapStopper plans for extended usage`
    },
    {
      id: "account",
      title: "3. NapStopper Account Registration and Use",
      icon: Users,
      content: `**NapStopper Account Plans:**
• **Free Plan**: Up to 3 URLs, 21,600 minutes of initial free credits, additional free credits available through manual requests
• **Paid Plan**: Up to 3 URLs, unlimited monitoring time for $1 monthly fee
• NapStopper reserves the right to limit the total number of users during beta periods`
    },
    {
      id: "pricing",
      title: "4. NapStopper Service Plans and Pricing",
      icon: CreditCard,
      content: `**4.1 NapStopper Free Plan**
• Includes 21,600 minutes of free credits upon initial NapStopper registration
• Limited to 3 registered URLs
• Pings every 10 minutes
• Additional free credits must be manually requested through the NapStopper platform
• Free users must visit the NapStopper website and click "Add Credit" to receive additional free credits (no charge)
• NapStopper reserves the right to limit or modify free credit distribution at any time

**4.2 NapStopper Paid Plan**
• $1 monthly fee for unlimited monitoring time
• Unlimited URLs
• Pings every 6 minutes
• No need to manually request additional credits
• All NapStopper fees are charged in advance

**4.3 NapStopper Plan Cancellation**
• You may cancel your paid plan at any time through your NapStopper account settings
• Upon cancellation, your account will be immediately reverted to the free plan
• You will retain access to the free plan benefits (up to 3 URLs, manual credit requests)
• No refunds will be provided for unused time on paid plans as per the no-refund policy`
    },
    {
      id: "payment",
      title: "5. NapStopper Payment and Billing",
      icon: CreditCard,
      content: `**5.1 NapStopper Payment Processing**
• All NapStopper payments are processed securely through third-party payment processors
• You authorize NapStopper to charge your payment method for applicable fees

**5.2 NapStopper No Refund Policy**
**ALL NAPSTOPPER SALES ARE FINAL. NapStopper does not provide refunds for any purchases, including but not limited to:**
• The $1 NapStopper paid plan fee
• Unused NapStopper credits (free users only)
• NapStopper service cancellations
• Dissatisfaction with NapStopper service performance
• Technical issues beyond NapStopper's reasonable control
• Changes in your hosting requirements

**5.3 NapStopper Credit System**
• **Free Users**: Credits are consumed based on NapStopper usage (per minute of monitoring). When credits run low, you must manually visit the NapStopper platform and request additional free credits through the "Add Credit" feature
• **Paid Users**: Unlimited monitoring time after $1  monthly payment to NapStopper
• Free credits do not expire but are non-transferable and non-refundable
• You are responsible for monitoring your NapStopper credit balance (free users only)
• NapStopper reserves the right to modify free credit amounts and distribution methods`
    },
    {
      id: "acceptable-use",
      title: "6. NapStopper Acceptable Use Policy",
      icon: Shield,
      content: `**6.1 Permitted Use of NapStopper**
• You may only register URLs that you own or have permission to monitor with NapStopper
• URLs must respond to HTTP GET requests with valid responses
• NapStopper use must comply with all applicable laws and regulations

**6.2 Prohibited Activities with NapStopper**
• Registering URLs you do not own or lack permission to access
• Using NapStopper to monitor illegal or harmful content
• Attempting to overwhelm or abuse the NapStopper monitoring infrastructure
• Sharing NapStopper account credentials with others
• Circumventing NapStopper usage limits or restrictions`
    },
    {
      id: "availability",
      title: "7. NapStopper Service Availability and Limitations",
      icon: AlertTriangle,
      content: `**7.1 NapStopper Service Level**
• NapStopper strives to maintain reliable service but does not guarantee 100% uptime
• NapStopper monitoring frequency is approximately every 10 minutes (may vary slightly)
• NapStopper reserves the right to modify monitoring intervals as needed

**7.2 NapStopper Service Limitations**
• NapStopper is not responsible for your application's actual uptime or availability
• The NapStopper Service only sends HTTP requests; we cannot fix underlying application issues
• NapStopper Service may be temporarily unavailable for maintenance or technical issues`
    }
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
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">NapStopper Terms of Service</h1>
          </div>
          <p className="text-gray-600 text-lg">Last Updated: August 27, 2025</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Key Highlights */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-8">
            <h2 className="text-2xl font-bold mb-4">NapStopper Key Points</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <span>NapStopper free plan: 3 URLs, manual credit requests</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <span>NapStopper paid plan: $1 monthly  for unlimited time</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <span>NapStopper no refunds policy applies to all purchases</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <span>NapStopper plan cancellation reverts to free plan immediately</span>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="p-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={section.id} className={`${index !== 0 ? 'border-t border-gray-200 pt-8' : ''} mb-8`}>
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <div className="ml-12">
                    {formatContent(section.content)}
                  </div>
                </div>
              );
            })}

            {/* Additional Sections */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <Shield className="w-5 h-5 text-gray-600" />
                </div>
                8. NapStopper Data and Privacy
              </h3>
              <div className="ml-12 text-gray-700 space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">8.1 NapStopper Data Collection</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• NapStopper collects minimal data necessary to provide the Service (URLs, email addresses)</li>
                    <li>• NapStopper does not store response content from your applications</li>
                    <li>• NapStopper may collect usage statistics for service improvement</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">8.2 NapStopper Data Security</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• NapStopper implements reasonable security measures to protect your data</li>
                    <li>• You are responsible for ensuring your registered URLs do not expose sensitive information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Disclaimers */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="bg-red-100 p-2 rounded-lg mr-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                9. NapStopper Disclaimers and Limitation of Liability
              </h3>
              <div className="ml-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-800 mb-2">9.1 NapStopper Service Disclaimers</h4>
                  <ul className="text-red-700 space-y-1 text-sm">
                    <li>• THE NAPSTOPPER SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND</li>
                    <li>• NAPSTOPPER DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE</li>
                    <li>• NAPSTOPPER DOES NOT GUARANTEE THAT YOUR APPLICATIONS WILL REMAIN AWAKE OR AVAILABLE</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">9.2 NapStopper Limitation of Liability</h4>
                  <ul className="text-red-700 space-y-1 text-sm">
                    <li>• NAPSTOPPER'S LIABILITY IS LIMITED TO THE AMOUNT YOU PAID FOR THE SERVICE IN THE LAST 12 MONTHS</li>
                    <li>• NAPSTOPPER IS NOT LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES</li>
                    <li>• NAPSTOPPER IS NOT RESPONSIBLE FOR DOWNTIME, DATA LOSS, OR BUSINESS INTERRUPTION</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Legal Section */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                10. Changes to NapStopper Terms
              </h3>
              <div className="ml-12 text-gray-700">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="mb-2">
                    NapStopper may modify these Terms of Service from time to time:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>• NapStopper will update the "Last Updated" date when changes are made</li>
                    <li>• NapStopper will notify users of significant changes via email</li>
                    <li>• Continued use of NapStopper after changes means you accept the updated terms</li>
                    <li>• Current terms are always available on the NapStopper website</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-8">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold text-orange-800 mb-2">NapStopper Agreement</h3>
                <p className="text-orange-700">
                  By using the **NapStopper** Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
                <div className="mt-4 text-sm text-orange-600">
                  <p>Questions about NapStopper? Contact us through our platform or support channels.</p>
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