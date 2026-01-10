import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DataProtection = () => {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#C7913E] to-white py-20 px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold grad-text leading-tight uppercase mb-4">
                        DATA PROTECTION (GDPR COMPLIANCE)
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-slate-800 tracking-wide uppercase">
                        Privacy, Lawful Processing & International Standards
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 container mx-auto px-6 py-12 max-w-4xl">

                <div className="space-y-12 text-gray-800">
                    {/* Section 1 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">1.</span>
                            INSTITUTIONAL COMMITMENT TO DATA PROTECTION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Moda Week International (MWINTL) is committed to the lawful, responsible, and secure processing of personal data in accordance with the General Data Protection Regulation (GDPR – EU Regulation 2016/679) and all applicable international data protection and privacy laws.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            As a global fashion, culture, and philanthropic platform, MWINTL recognizes that data protection is not only a legal obligation, but a fundamental element of professional ethics, institutional trust, and international credibility. All personal data is handled with the highest standards of confidentiality, integrity, and discretion.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">2.</span>
                            SCOPE OF APPLICATION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            This Data Protection Policy applies to all individuals and entities who interact with MWINTL, including but not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Members and philanthropic participants</li>
                            <li>Fashion designers, models, and creatives</li>
                            <li>Staff, production teams, and contractors</li>
                            <li>Clients, partners, sponsors, and affiliates</li>
                            <li>Media representatives and accredited guests</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            This policy governs all personal data processed through MWINTL’s websites, platforms, applications, events, communications, and operational systems.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">3.</span>
                            LAWFUL BASIS FOR PROCESSING
                        </h3>
                        <p className="mb-4 text-gray-600">
                            MWINTL processes personal data only when a lawful basis exists, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Performance of contractual and participation obligations</li>
                            <li>Legitimate operational, security, and institutional interests</li>
                            <li>Compliance with legal and regulatory duties</li>
                            <li>Consent, where required by law</li>
                            <li>Protection of the rights, safety, and integrity of MWINTL and its participants</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            All processing is conducted in alignment with the GDPR principles of lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, storage limitation, and integrity.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">4.</span>
                            CATEGORIES OF DATA COLLECTED
                        </h3>
                        <p className="mb-4 text-gray-600">
                            MWINTL may collect and process the following categories of data:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Identification and contact information</li>
                            <li>Professional, brand, and institutional details</li>
                            <li>Registration, credentialing, and accreditation data</li>
                            <li>Media and press verification records</li>
                            <li>Security and access control information</li>
                            <li>Communications and operational correspondence</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            MWINTL does not collect unnecessary data and does not process personal data outside the scope of its institutional activities.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">5.</span>
                            PURPOSES OF DATA PROCESSING
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Personal data is processed for purposes including, but not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Event registration, credentialing, and participation management</li>
                            <li>Membership and partnership administration</li>
                            <li>Media accreditation and access verification</li>
                            <li>Security, compliance, and risk management</li>
                            <li>Official communications and operational coordination</li>
                            <li>Internal analytics, reporting, and strategic development</li>
                            <li>Fulfillment of legal and regulatory obligations</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            Personal data is never used in a manner incompatible with these purposes.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">6.</span>
                            DATA SECURITY & CONFIDENTIALITY
                        </h3>
                        <p className="mb-4 text-gray-600">
                            MWINTL applies technical, organizational, and administrative safeguards appropriate to the sensitivity of the data processed.
                            These measures are designed to protect personal data against:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Unauthorized access</li>
                            <li>Unlawful disclosure</li>
                            <li>Loss, misuse, alteration, or destruction</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            Access to personal data is limited strictly to authorized personnel and professional partners operating under confidentiality obligations.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">7.</span>
                            INTERNATIONAL DATA PROCESSING
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            International data transfers occur, MWINTL implements appropriate safeguards consistent with GDPR requirements to ensure that data protection standards remain effectively equivalent.
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <h2 className="text-2xl font-serif font-bold text-[#C7913E] tracking-wider mb-2">FINAL DATA PROTECTION STATEMENT</h2>
                    <p className="text-gray-600 mb-2">
                        Moda Week International treats data protection as a core institutional responsibility. Personal data entrusted to MWINTL is handled with professional discipline, legal compliance, and international respect.
                    </p>
                    <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mt-4">
                        Moda Week International
                    </p>
                    <p className="text-gray-500 uppercase tracking-widest text-xs">
                        Global Fashion. Institutional Responsibility. Data Integrity.
                    </p>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default DataProtection;
