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

        {/* Section 1 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            1. Introduction
          </h2>
          <p>
            Welcome to Ace Elite Properties LLC (&ldquo;we&ldquo;,
            &ldquo;our,&ldquo; &ldquo;us,&ldquo; or &ldquo;the Agency&ldquo;), a
            proud member of the OInnovation Group family. As part of a
            forward-thinking and innovation-driven group, we are committed to
            delivering exceptional real estate services and digital experiences.
            <br />
            <br />
            These Terms of Service (&ldquo;Terms&ldquo;) outline the rules and
            guidelines for using our website and services. By accessing or
            interacting with our platform, you agree to be bound by these Terms
            and help us maintain a trusted and transparent environment for all
            users.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            2. User Responsibilities
          </h2>
          <p>
            Users must provide accurate information when registering or
            submitting inquiries. You agree not to use the website for any
            unlawful or prohibited activities, including but not limited to
            fraud, harassment, or infringement of intellectual property rights.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            3. Scope of Services
          </h2>
          <p>
            Our website provides information about real estate properties,
            including but not limited to listings for off-plan sales, resales
            and rentals, agent contact details, and market insights. We
            facilitate connections between users and licensed real estate agents
            but do not guarantee property availability or transaction outcomes.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            4. Property Listings
          </h2>
          <p>
            Our website features property listings provided by both agents
            directly employed by the agency and third-party agents or
            developers. All listings are intended to be accurate and up-to-date;
            however, the agency does not guarantee the completeness or accuracy
            of information provided by third-party contributors.
            <br />
            <br />
            The material presented on this site is solely for general
            informational use and should not be interpreted as a proposal,
            invitation, or encouragement to engage in any property-related
            transaction, including buying, selling, leasing, or investing. It
            also does not constitute professional advice or guidance for
            financial or investment decisions.
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            5. Agent Interactions
          </h2>
          <p>
            Users may interact with agents who are either directly employed by
            the agency or affiliated third-party agents and developers. While
            the agency may facilitate introductions or communications, it does
            not assume liability for the actions or omissions of third-party
            agents or developers.
          </p>
        </div>

        {/* Section 6 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            6. Intellectual Property
          </h2>
          <p>
            All content available on this website is either owned by the Agency
            or used with permission. Unauthorized use may result in legal action
            under UAE law.
          </p>
        </div>

        {/* Section 7 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            7. Privacy Policy Summary and Explicit Consent for Data Collection
          </h2>
          <p>
            By using this website or submitting forms, you consent to our
            collection and use of your personal data in line with our Privacy
            Policy. We do not sell user data. You may withdraw consent at any
            time by contacting us at{" "}
            <span className="text-blue-600 font-medium">
              admin@aceeliteproperties.com
            </span>
            . See full policy at:{" "}
            <a
              href="https://aceeliteproperties.com/privacy"
              className="text-blue-600 underline"
            >
              aceeliteproperties.com/privacy
            </a>
          </p>
        </div>

        {/* Section 8 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            8. Disclaimers
          </h2>
          <p>
            Our website and services are provided &ldquo;as is&ldquo; without
            warranties of any kind. Continued use constitutes acceptance of
            revised terms.
          </p>

          <h3 className="font-semibold mt-4 mb-2 text-blue-500">
            8.1 Payments Disclaimer
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Real Estate Agents are UNAUTHORIZED to receive payments to
              personal accounts.
            </li>
            <li>Cash must go through the official finance team.</li>
            <li>
              Receipts are issued only via our official email:{" "}
              <span className="text-blue-600 font-medium">
                admin@aceeliteproperties.com
              </span>
            </li>
          </ul>
          <p className="mt-2">
            For clarification, contact:{" "}
            <span className="text-blue-600 font-medium">
              finance@oinnovationgroup.com
            </span>
          </p>
        </div>

        {/* Section 9 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            9. Limitations of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, we are not liable for
            indirect or consequential damages resulting from use of the website
            or services.
          </p>
        </div>

        {/* Section 10 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            10. Dispute Resolution
          </h2>
          <p>
            Disputes shall be resolved via mediation or arbitration in the UAE.
            Unresolved matters may proceed to UAE courts.
          </p>
        </div>

        {/* Section 11 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            11. Governing Law
          </h2>
          <p>
            These Terms are governed by the laws of the United Arab Emirates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
