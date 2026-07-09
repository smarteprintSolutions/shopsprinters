import React from 'react';

const DoNotSellPage = () => {
  return (
    <main className="bg-white min-h-screen">
      {/* Header Section - Matches Policy UI */}
      <section className="pt-40 pb-20 bg-[#fdf2f2]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-[42px] md:text-[54px] font-[900] text-dark mb-6 leading-tight">
            Do Not Sell or Share My Personal Information
          </h1>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-10 text-gray-600 font-medium italic">
          <p>Effective Date: January 27, 2026</p>
          <p>Last Updated: January 27, 2026</p>
        </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-12">
            <p className="text-lg">
              <span className="font-bold">Shops Printers</span> (“we,” “us,” “our”) provides this notice under the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA). This page explains how you can exercise your right to opt out of the “sale” or “sharing” of your personal information, as those terms are defined under California law.
            </p>

            {/* Section 1 */}
            <div>
              <h2 className="text-[32px] md:text-[42px] font-[900] text-dark mb-6 leading-tight">1. Do We Sell or Share Personal Information?</h2>
              <p className="mb-4">Shops Printers does not knowingly “sell” or “share” your personal information in exchange for money or other valuable consideration.</p>
              <p className="italic">In the ordinary course of business, we may share personal information with trusted service providers who help operate our website, process payments, ship orders, and provide support—these are not considered a “sale” or “sharing” under CCPA/CPRA.</p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-[32px] md:text-[42px] font-[900] text-dark mb-6 leading-tight">2. Your Right to Opt Out</h2>
              <p className="mb-4">Even though we do not sell or share your personal information, we respect your rights under CCPA/CPRA, and we provide you with an easy access to our policies, you may request:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Confirmation that your personal information is not sold or shared</li>
                <li>Information about what personal information we collect and how it is used</li>
                <li>The ability to request that we do not sell or share your personal information, even if we were to do so in the future</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-[32px] md:text-[42px] font-[900] text-dark mb-6 leading-tight">3. How to Submit a Request</h2>
              <p className="mb-4">To exercise your right to opt out of the sale or sharing of personal information (including opting out of cross‑contextual advertising or any future sale or sharing, you may:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email us at <span className="text-[#ff2d46] font-bold">support@shopsprinters.com</span> with your request.</li>
                <li>You may also update your preferences regarding our Cookie Policy.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-[32px] md:text-[42px] font-[900] text-dark mb-6 leading-tight">4. Verification</h2>
              <p className="mb-4">We may request additional information to verify your identity before fulfilling any request, as required by law.</p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-[32px] md:text-[42px] font-[900] text-dark mb-6 leading-tight">5. Authorized Agents</h2>
              <p className="mb-4">You may authorize an agent to act on your behalf. If you use an authorized agent, we may also verify the agent’s authorization and your identity.</p>
            </div>

            {/* Section 6 */}
            <div>
               <h2 className="text-[32px] md:text-[42px] font-[900] text-dark mb-6 leading-tight">6. Contact Information</h2>
               <div className="bg-[#fcfcfc] p-10 rounded-[30px] border border-gray-100">
                  <h4 className="text-xl font-black text-dark mb-2">Shops Printers</h4>
                  <p className="font-medium text-gray-600 mb-1">17807 Lakecrest View Drive, #1205</p>
                  <p className="font-medium text-gray-600 mb-1">Cypress, TX 77433, United States</p>
                  <p className="font-medium text-gray-600 mb-1">Email: <span className="text-[#ff2d46]">support@shopsprinters.com</span></p>
                  <p className="font-medium text-gray-600">Website: <span className="text-[#ff2d46]">https://shopsprinters.com</span></p>
               </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default DoNotSellPage;