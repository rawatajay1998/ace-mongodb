import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy Policy | Ace Elite Properties Dubai",
  description:
    "Learn how Ace Elite Properties Dubai collects, uses, and protects your personal information. Read our privacy policy.",
};

const PrivacyPolicyPage = () => {
  return (
    <section>
      <div className="container mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Privacy Policy
        </h1>

        <p className="mb-4">
          <strong className="text-blue-600">Ace Elite Properties Dubai</strong>{" "}
          is committed to protecting your privacy. This Privacy Policy explains
          how we collect, use, and safeguard your information.
        </p>

        {/* Section 1 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Personal Information:</strong> Name, email, phone number,
              nationality, ID documents.
            </li>
            <li>
              <strong>Property Preferences:</strong> Location, budget, property
              type.
            </li>
            <li>
              <strong>Usage Data:</strong> IP address, browser info, visited
              pages, etc.
            </li>
            <li>
              <strong>Communication Data:</strong> Data from emails, forms,
              WhatsApp, calls, chats.
            </li>
          </ul>
        </div>

        {/* div 2 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To provide tailored property listings.</li>
            <li>To respond to your inquiries.</li>
            <li>To arrange property transactions and viewings.</li>
            <li>To send promotional updates (with your consent).</li>
            <li>To analyze and improve our website/services.</li>
          </ul>
        </div>

        {/* div 3 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            3. Sharing Your Information
          </h2>
          <p className="mb-2">
            We do not sell your data. Information may be shared with:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Real estate agents and developers.</li>
            <li>Third-party service providers (hosting, email, analytics).</li>
            <li>Legal/regulatory authorities if required.</li>
          </ul>
        </div>

        {/* div 4 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            4. Data Security
          </h2>
          <p>
            We use SSL encryption and regularly review our practices to protect
            your data from unauthorized access or misuse.
          </p>
        </div>

        {/* div 5 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            5. Your Rights
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Access your personal data.</li>
            <li>Request corrections or deletion.</li>
            <li>Withdraw consent for marketing.</li>
          </ul>
        </div>

        {/* div 6 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            6. Cookies
          </h2>
          <p>
            We use cookies for a better user experience. You can disable them
            via your browser settings.
          </p>
        </div>

        {/* div 7 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            7. Third-Party Links
          </h2>
          <p>
            We are not responsible for the privacy practices of external
            websites linked on our site. Please review their policies.
          </p>
        </div>

        {/* div 8 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this policy from time to time. The latest version will
            always be posted here.
          </p>
        </div>

        {/* div 9 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            9. Contact Us
          </h2>
          <p>
            Ace Elite Properties Dubai
            <br />
            Email:{" "}
            <span className="text-blue-600 font-medium">[Insert Email]</span>
            <br />
            Phone:{" "}
            <span className="text-blue-600 font-medium">[Insert Phone]</span>
            <br />
            Website:{" "}
            <span className="text-blue-600 font-medium">[Insert URL]</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
