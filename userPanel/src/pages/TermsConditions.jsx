import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsConditions = () => {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#C7913E] to-white py-20 px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold grad-text leading-tight uppercase mb-4">
                        TERMS & CONDITIONS
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-slate-800 tracking-wide uppercase">
                        Moda Week International (MWINTL)
                        <span className="block text-sm md:text-base mt-2 font-normal normal-case">
                            Legal Use | Participation | Ticket & Access Rules
                        </span>
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 container mx-auto px-6 py-12 max-w-4xl">

                {/* Important Legal Notice */}
                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-xl mb-12 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-[#C7913E]">IMPORTANT LEGAL NOTICE</h2>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                        These Terms & Conditions govern the use of MWINTL platforms, attendance at MWINTL events, participation in any capacity, and the purchase or use of tickets, credentials, memberships, or access passes.
                        By accessing, registering, purchasing, attending, or participating in any MWINTL-related activity, you irrevocably agree to be bound by these Terms & Conditions, together with MWINTL’s Privacy, GDPR, Media & Confidentiality Policy.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-4 font-semibold text-sm md:text-base">
                        If you do not agree, you must not participate. These Terms are unilateral, non-negotiable, and enforceable exclusively in favor of MWINTL.
                    </p>
                </div>

                <div className="space-y-12 text-gray-800">
                    {/* Section 1 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">01.</span>
                            ELIGIBILITY & AUTHORIZED USE
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Participation in MWINTL events, platforms, or programs is limited to individuals and entities who:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Are legally capable of entering binding agreements.</li>
                            <li>Provide accurate and truthful information.</li>
                            <li>Comply fully with MWINTL policies, codes, and instructions.</li>
                            <li>Conduct themselves in a manner consistent with MWINTL’s institutional standards.</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            MWINTL reserves the absolute right to deny, suspend, or revoke access at any time, with or without cause.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">02.</span>
                            TICKETS, CREDENTIALS & ACCESS RIGHTS
                        </h3>

                        <div className="mb-6">
                            <h4 className="font-bold text-lg mb-2 text-gray-800">2.1 Nature of Tickets & Credentials</h4>
                            <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                <li>Tickets, badges, passes, and credentials grant a revocable, not a property right.</li>
                                <li>All access remains subject to MWINTL approval and control.</li>
                                <li>Possession of a ticket does not guarantee entry.</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-lg mb-2 text-gray-800">2.2 Non-Transferability</h4>
                            <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                <li>Tickets and credentials are non-transferable, unless expressly authorized by MWINTL Executive.</li>
                                <li>Unauthorized resale, sharing, duplication, or misuse is strictly prohibited.</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-2 text-gray-800">2.3 Access Control</h4>
                            <p className="mb-2 text-gray-600">MWINTL reserves the right to:</p>
                            <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                <li>Conduct identity verification and security screening.</li>
                                <li>Deny or revoke access for policy violations or security concerns.</li>
                                <li>Modify seating, schedules, venues, or access zones at its discretion.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">03.</span>
                            NO REFUNDS, CANCELLATIONS & CHANGES
                        </h3>
                        <p className="mb-4 text-gray-600">
                            All ticket purchases, participation fees, and access payments are final.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>No refunds under any circumstances.</li>
                            <li>No exchanges unless expressly approved by MWINTL.</li>
                            <li>Event details (date, venue, schedule, format) may change without liability.</li>
                        </ul>
                        <p className="text-gray-600">
                            MWINTL shall not be responsible for travel, accommodation, or related costs.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">04.</span>
                            PARTICIPATION RULES & CONDUCT
                        </h3>
                        <p className="mb-4 text-gray-600">
                            All participants must:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Follow MWINTL rules, instructions, and security protocols.</li>
                            <li>Act with professionalism, respect, and discretion.</li>
                            <li>Refrain from disruptive, abusive, defamatory, or inappropriate conduct.</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            Any behavior deemed inconsistent with MWINTL values or interests may result in immediate law force removal.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">05.</span>
                            INTELLECTUAL PROPERTY
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            All content associated with MWINTL including names, logos, trademarks, designs, visuals, programs, and event formats is the exclusive property of MWINTL or its licensors. No use, reproduction, or association is permitted without written authorization.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">06.</span>
                            ASSUMPTION OF RISK & LIMITATION OF LIABILITY
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Participants attend and participate at their own risk. To the fullest extent permitted by law:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>MWINTL shall not be liable for personal injury, loss, theft, or damage</li>
                            <li>MWINTL shall not be liable for indirect, incidental, or consequential damages</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">07.</span>
                            INDEMNIFICATION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Participants agree to indemnify and hold harmless MWINTL, its leadership, partners, and affiliates from any claims, losses, damages, or expenses arising from:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>Their conduct or participation</li>
                            <li>Violation of these Terms</li>
                            <li>Unauthorized use of MWINTL property or content</li>
                        </ul>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">08.</span>
                            TERMINATION & ENFORCEMENT
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-2">
                            MWINTL may terminate participation, access, or membership immediately and without notice for any violation of these Terms.
                        </p>
                        <p className="text-gray-600 font-medium">
                            No refunds or compensation shall be owed.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">09.</span>
                            GOVERNING LAW & JURISDICTION
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-2">
                            These Terms are governed exclusively by the laws of the United States of America.
                        </p>
                        <p className="text-gray-600">
                            MWINTL retains sole discretion to select jurisdiction and venue. Participants waive all objections and submit irrevocably to MWINTL’s chosen forum.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">10.</span>
                            SEVERABILITY & INTERPRETATION
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            If any provision is found unenforceable, the remaining provisions remain in full force. MWINTL retains sole authority to interpret and enforce these Terms.
                        </p>
                        <div className="bg-black text-white p-6 rounded-lg text-center mt-8">
                            <p className="text-lg font-medium mb-2">Moda Week International is a private, high level global platform.</p>
                            <p className="text-gray-300">Access and participation are privileges, not rights. Failure to comply with these Terms will result in immediate enforcement, without exception.</p>
                        </div>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <h2 className="text-2xl font-serif font-bold text-[#C7913E] tracking-wider mb-2">MODA WEEK INTERNATIONAL.</h2>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Global Fashion. Institutional Governance. Absolute Authority.</p>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default TermsConditions;
