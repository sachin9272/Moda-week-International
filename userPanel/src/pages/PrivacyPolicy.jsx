import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#C7913E] to-white py-20 px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold grad-text leading-tight uppercase mb-4">
                        PRIVACY & POLICY
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-slate-800 tracking-wide uppercase">
                        Moda Week International (MWINTL)
                        <span className="block text-sm md:text-base mt-2 font-normal normal-case">
                            Data Protection, Privacy, Media & Confidentiality Policy
                        </span>
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 container mx-auto px-6 py-12 max-w-4xl">

                {/* Important Notice */}
                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-xl mb-12 shadow-sm">
                    <h2 className="text-xl font-bold mb-2 text-[#C7913E]">IMPORTANT NOTICE: PERSONAL DATA, CONFIDENTIALITY & MEDIA USE</h2>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                        Valued Attendees, Fashion Designers, Partners, Media Representatives, and All the Accredited Participants,
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                        We extend our warm regards as we prepare for an upcoming edition of Moda Week International (MWINTL). As an international fashion platform operating at the highest professional and ethical standards, MWINTL is fully committed to data protection, confidentiality, intellectual property protection, and strict compliance with the General Data Protection Regulation (GDPR) and all applicable international privacy and media laws.
                    </p>
                    <p className="text-gray-700 leading-relaxed font-semibold text-sm md:text-base">
                        This notice serves as a formal legal disclosure and binding condition of participation.
                    </p>
                </div>

                <div className="space-y-12 text-gray-800">
                    {/* Section 1 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">1.</span>
                            PERSONAL DATA COLLECTION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            In the course of organizing, administering, and executing MWINTL events, we may lawfully collect and process the following personal data:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li><strong>Attendees & Guests:</strong> Full name, email address, phone number, credentials</li>
                            <li><strong>Fashion Designers:</strong> Personal, professional, brand, and registration details</li>
                            <li><strong>Partners & Sponsors:</strong> Corporate, contractual, and representative information</li>
                            <li><strong>Media & Press:</strong> Accreditation data, identification, contact details</li>
                            <li><strong>Participants & Staff:</strong> Operational and compliance-related information</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">2.</span>
                            PURPOSE OF DATA PROCESSING
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Personal data is collected solely for legitimate, necessary, and lawful purposes, including but not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Event registration, credentialing, and verification</li>
                            <li>Official communications, scheduling, and logistics</li>
                            <li>Security, access control, and compliance management</li>
                            <li>Internal analytics for future MWINTL editions</li>
                            <li>Legal, contractual, and regulatory obligations</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            MWINTL does not sell, trade, or unlawfully distribute personal data.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">3.</span>
                            DATA SECURITY & CONFIDENTIALITY
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            MWINTL implements strict technical, organizational, and legal safeguards to protect all personal data against unauthorized access, misuse, disclosure, alteration, or destruction. All authorized personnel, contractors, and partners are bound by confidentiality agreements and data-protection obligations.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">4.</span>
                            PARTICIPANT CONDUCT, CONFIDENTIALITY & NON-DISPARAGEMENT POLICY
                        </h3>
                        <p className="text-sm font-bold text-red-600 mb-4 uppercase tracking-wide">Strict Restrictions | Zero-Tolerance Enforcement</p>
                        <p className="text-gray-600 mb-6">
                            Moda Week International (MWINTL) brand, its reputation, intellectual property, participants, and global partners, the following conditions are mandatory and non-negotiable for all participants.
                        </p>

                        <div className="mb-8">
                            <h4 className="font-bold text-lg mb-2 text-gray-800">4.1. Brand Protection & Prohibition, Non-Disparagement Disclosure Obligation</h4>
                            <p className="text-gray-600 mb-3">
                                All participants, including but not limited to fashion designers, models, stylists, creatives, guests, staff, contractors, media representatives, and partners, are hereby STRICTLY PROHIBITED from:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                                <li>Make, publish, share, or imply negative, misleading, defamatory, or harmful statements about MWINTL</li>
                                <li>Engage in public criticism, commentary, insinuations, or complaints regarding any MWINTL event, decision, production process, or affiliated party</li>
                                <li>Damage, attempt to damage, or undermine the reputation, credibility, or brand value of MWINTL in any forum, public or private</li>
                            </ul>
                            <p className="text-gray-500 italic text-sm">
                                This includes social media, interviews, press statements, online reviews, private groups, messaging platforms, and verbal statements.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-2 text-gray-800">4.2. Mandatory Private Resolution of Disputes</h4>
                            <p className="text-gray-600 mb-2">
                                Any concern, dissatisfaction, dispute, or regulatory matter MUST be addressed exclusively and privately by contacting MWINTL in writing.
                            </p>
                            <p className="text-[#C7913E] font-medium mb-4">Official Contact: inquiry@modaweekinternational.com</p>
                            <p className="text-gray-600 mb-2">Participants are strictly prohibited from:</p>
                            <ul className="list-disc pl-6 space-y-1 text-gray-600 mb-4">
                                <li>Escalating issues publicly</li>
                                <li>Engaging third parties without prior notice</li>
                                <li>Posting complaints or commentary online</li>
                                <li>Making public accusations or narratives</li>
                            </ul>
                            <p className="text-gray-600 font-medium">
                                MWINTL will review all concerns professionally, legally and confidentially, and in good faith.
                            </p>
                        </div>
                    </section>

                    {/* Section 3 (Duplicate Numbering in Compliance with Input, but treating as separate section) */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">3.</span>
                            ZERO-TOLERANCE ENFORCEMENT
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Any violation of this policy shall result in immediate and unilateral action, which may include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Immediate removal from the event</li>
                            <li>Revocation of credentials and access</li>
                            <li>Financial liability for damages</li>
                            <li>Legal action, including injunctive relief and monetary claims</li>
                            <li>Permanent disqualification from future MWINTL events, activities, and worldwide projects</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            No warnings are required. Enforcement is immediate.
                        </p>
                    </section>

                    {/* Section 4 (Duplicate Numbering in Compliance with Input) */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">4.</span>
                            ACKNOWLEDGMENT & BINDING AGREEMENT
                        </h3>
                        <p className="mb-4 text-gray-600">
                            By participating in any MWINTL-related activity, participants:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Acknowledge full understanding of these restrictions</li>
                            <li>Agree to comply without exception</li>
                            <li>Accept full legal responsibility for any breach</li>
                            <li>Waive any claim arising from enforcement actions</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            These obligations survive the conclusion of the event and termination of participation.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">5.</span>
                            CONSENT & LEGAL AGREEMENT
                        </h3>
                        <p className="mb-4 text-gray-600">
                            By registering, attending, participating in, collaborating with, or engaging in any MWINTL-related activity, you:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Acknowledge receipt of this notice</li>
                            <li>Provide explicit consent to data processing as outlined</li>
                            <li>Agree to all confidentiality, media, and enforcement terms</li>
                            <li>Accept full legal responsibility for compliance</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">6.</span>
                            REFUND & PRODUCTION CREDIT POLICY
                        </h3>
                        <p className="text-gray-800 font-medium mb-2">Fashion Designers & Entitled Contracts Participants</p>
                        <p className="mb-4 text-gray-600">
                            MWINTL maintains a strict, transparent, and non-negotiable No-Refund Policy.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>No refunds are issued for voluntary withdrawal or non-participation</li>
                            <li>Eligible participants may receive Production Credits instead</li>
                            <li>Written notice of withdrawal must be submitted at least 181 days prior to the event</li>
                            <li>
                                Production Credits:
                                <ul className="list-circle pl-6 mt-1 space-y-1">
                                    <li>Valid for one (1) year</li>
                                    <li>Applicable only to future MWINTL designer events</li>
                                    <li>Non-transferable and non-redeemable for cash</li>
                                </ul>
                            </li>
                        </ul>
                        <p className="text-gray-600 mb-2">Failure to comply with notification timelines may result in loss of eligibility.</p>
                        <p className="text-gray-600">MWINTL reserves the right to modify or amend this policy at its discretion, with formal notice provided.</p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">7.</span>
                            GOVERNING LAW & JURISDICTION
                        </h3>

                        <div className="mb-6">
                            <h4 className="font-bold text-lg mb-2 text-gray-800">7.1. United States Jurisdiction</h4>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                This Agreement, including all privacy, data protection, media, intellectual property, participation, and enforcement provisions, shall be governed by and construed in accordance with the laws of the United States of America, without regard to conflict-of-law principles.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                Any dispute, claim, or legal action arising out of or relating to Moda Week International (MWINTL), its events, services, platforms, or agreements shall be subject to the exclusive jurisdiction of the state and federal courts of the United States, at the sole discretion of MWINTL.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Participants expressly consent to personal jurisdiction and venue in such courts and waive any objection based on forum non conveniens or lack of jurisdiction.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-lg mb-2 text-gray-800">7.2. European Union (EU) Jurisdiction & GDPR Authority</h4>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                For participants, partners, designers, or entities located in or operating within the European Union, this Agreement shall additionally comply with and be interpreted in accordance with:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-gray-600 mb-3">
                                <li>The General Data Protection Regulation (EU) 2016/679 (GDPR)</li>
                                <li>Applicable EU privacy, consumer protection, and digital media laws</li>
                            </ul>
                            <p className="text-gray-600 leading-relaxed">
                                Any GDPR-related disputes, data protection complaints, or regulatory matters may be submitted to the competent supervisory authority within the European Union, without limiting MWINTL’s right to pursue parallel or primary legal action in the United States or other competent jurisdictions.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-lg mb-2 text-gray-800">7.3. International Jurisdiction & Cross-Border Enforcement</h4>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                Given the global nature of MWINTL, participants acknowledge and agree that:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-gray-600 mb-3">
                                <li>MWINTL operates internationally</li>
                                <li>Violations may result in cross-border legal enforcement</li>
                                <li>Legal actions may be pursued in any jurisdiction where damages occur, rights are infringed, or enforcement is legally permissible</li>
                            </ul>
                            <p className="text-gray-600 leading-relaxed">
                                MWINTL reserves the absolute right to initiate legal proceedings in any country or jurisdiction worldwide where the infringing party resides, operates, conducts business, or where harm has occurred.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-lg mb-2 text-gray-800">7.4. Injunctive Relief & Emergency Legal Action</h4>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                Participants acknowledge that unauthorized disclosure, data misuse, media violations, or intellectual property infringement may cause irreparable harm to MWINTL.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                Accordingly, MWINTL shall be entitled to seek:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-gray-600 mb-3">
                                <li>Immediate injunctive relief</li>
                                <li>Temporary restraining orders</li>
                                <li>Emergency court actions</li>
                                <li>Equitable remedies</li>
                            </ul>
                            <p className="text-gray-600 leading-relaxed">
                                Without the requirement to post bond or prove monetary damages, in any competent court worldwide.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-lg mb-2 text-gray-800">7.5. Arbitration (Optional at MWINTL’s Sole Discretion)</h4>
                            <p className="text-gray-600 leading-relaxed">
                                At MWINTL’s sole discretion, any dispute may be resolved through confidential binding arbitration administered under internationally recognized arbitration rules. MWINTL retains the right to bypass arbitration and pursue direct legal action when necessary to protect its rights, reputation, or intellectual property.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-lg mb-2 text-gray-800">7.6. Waiver of Class Actions</h4>
                            <p className="text-gray-600 leading-relaxed mb-2">
                                To the fullest extent permitted by law, all claims must be brought individually. Participants waive the right to participate in:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                <li>Class actions</li>
                                <li>Collective claims</li>
                                <li>Representative proceedings</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-2 text-gray-800">7.7. Severability & Survival</h4>
                            <p className="text-gray-600 leading-relaxed mb-2">
                                If any provision of this jurisdiction clause is found invalid or unenforceable, the remaining provisions shall remain fully enforceable.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                All jurisdiction, confidentiality, privacy, intellectual property, and enforcement provisions shall survive termination of participation or agreement.
                            </p>
                        </div>
                    </section>

                    {/* Remaining Sections 8-15 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">8.</span>
                            MEMBERSHIP STATUS & REVOCATION CLAUSE
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Membership, accreditation, or participation within MWINTL is granted at the sole discretion of MWINTL and does not constitute a permanent or vested right. MWINTL reserves the unrestricted right to suspend, revoke, or terminate any membership or participation at any time, with or without cause, if conduct is deemed inconsistent with the values, integrity, reputation, or strategic interests of the organization.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">9.</span>
                            REPUTATIONAL RISK & MORAL CONDUCT STANDARD
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Participants and members are expected to uphold conduct consistent with the ethical, cultural, and reputational standards of MWINTL at all times. Any conduct public or private that may expose MWINTL to reputational risk, controversy, or public distrust may result in immediate review and enforcement action.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">10.</span>
                            NO AGENCY / NO REPRESENTATION CLAUSE
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            No participant, member, agent, representative, or third party is authorized to speak on behalf of MWINTL, represent MWINTL, or create obligations, statements, or interpretations unless expressly authorized in writing by MWINTL.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">11.</span>
                            IMAGE, NAME & LIKENESS CONTROL
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            The MWINTL name, logo, trademarks, events, and institutional identity may not be used, referenced, or associated with any content, promotion, commentary, or communication without prior written authorization.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">12.</span>
                            INDEMNIFICATION CLAUSE
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Participants agree to indemnify and hold harmless MWINTL, its leadership, partners, and affiliates from any claims, damages, losses, or expenses arising from their actions, statements, or violations of this Policy.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">13.</span>
                            CONFIDENTIALITY OF INVESTMENT & PHILANTHROPIC MATTERS
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            All discussions, negotiations, contributions, investment interests, and philanthropic strategies related to MWINTL are strictly confidential and may not be disclosed without express written authorization.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">14.</span>
                            INTERPRETATION AUTHORITY CLAUSE
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            MWINTL retains sole authority to interpret, apply, and enforce this Policy. Any ambiguity shall be resolved exclusively in favor of MWINTL.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">15.</span>
                            PRIVACY POLICY ACCESS
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            For full legal documentation, please review our Privacy Policy: <a href="http://www.modaweekinternational.com/privacy" className="text-[#C7913E] underline">www.modaweekinternational.com/privacy</a>
                        </p>
                    </section>

                    {/* Footer Note */}
                    <div className="bg-black text-white p-6 rounded-lg text-center mt-12">
                        <p className="text-lg font-medium mb-3">Moda Week International operates with zero tolerance for misconduct, data misuse, or intellectual property violations.</p>
                        <p className="text-gray-300">Participation is a privilege, not a right, and is granted solely under these legally binding conditions. We appreciate your professionalism, cooperation, and respect for the integrity of our global platform.</p>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <h2 className="text-2xl font-serif font-bold text-[#C7913E] tracking-wider mb-2">MODA WEEK INTERNATIONAL</h2>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Global Fashion. Institutional Integrity. Absolute Authority.</p>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
