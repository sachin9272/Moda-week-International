import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MediaReleasePolicy = () => {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#C7913E] to-white py-20 px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold grad-text leading-tight uppercase mb-4">
                        MEDIA RELEASE POLICY
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-slate-800 tracking-wide uppercase">
                        Press Relations | Accreditation | Coverage Standards
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 container mx-auto px-6 py-12 max-w-4xl">

                {/* Intro */}
                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-xl mb-12 shadow-sm">
                    <h2 className="text-xl font-bold mb-2 text-[#C7913E]">PREAMBLE | A WELCOME TO THE PRESS</h2>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                        Moda Week International (MWINTL) warmly welcomes members of the global press, media institutions, journalists, editors, broadcasters, and digital platforms who share our commitment to professionalism, cultural respect, artistic excellence, and institutional integrity.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                        MWINTL operates as a high-level international fashion, culture, and philanthropic platform. Our media relations are founded on mutual respect, structured accreditation, and responsible storytelling. This Media Release Policy establishes the official framework governing media participation, access, coverage, and publication in connection with MWINTL.
                    </p>
                </div>

                <div className="space-y-12 text-gray-800">
                    {/* Section 1 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">1.</span>
                            MEDIA ACCREDITATION & APPLICATION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            All media representatives wishing to cover any MWINTL event, production, or initiative must formally apply for accreditation.
                        </p>
                        <p className="text-red-500 font-bold mb-4">Press access is not automatic.</p>
                        <p className="mb-2 text-gray-600">Accreditation may be granted to, but is not limited to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Recognized media outlets</li>
                            <li>Journalists, editors, and correspondents</li>
                            <li>Television, radio, and digital broadcast platforms</li>
                            <li>Fashion, cultural, and business publications</li>
                            <li>Documentary and approved creative media teams</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            MWINTL reserves the sole and unrestricted right to approve, deny, limit, or revoke accreditation at any time. Submission of an application does not guarantee approval.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">2.</span>
                            ACCEPTANCE OF MWINTL POLICIES
                        </h3>
                        <p className="mb-4 text-gray-600">
                            All accredited media representatives are required to formally accept and comply with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>MWINTL Privacy & GDPR Policy</li>
                            <li>MWINTL Code of Conduct</li>
                            <li>MWINTL Media, Confidentiality & Non-Disparagement Policies</li>
                            <li>MWINTL Terms & Conditions</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            Accreditation constitutes full legal acknowledgment and acceptance of all MWINTL governing policies. Failure to comply may result in immediate removal, revocation of credentials, and permanent disqualification from future MWINTL events.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">3.</span>
                            SCOPE OF MEDIA ACCESS
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Media access may include, at MWINTL’s discretion:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Runway presentations and official showcases</li>
                            <li>Approved press areas and interviews</li>
                            <li>Designated photo and media zones</li>
                            <li>Official press briefings and curated opportunities</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            Access to backstage areas, rehearsals, private sessions, production zones, or philanthropic and investment meetings is strictly controlled and requires separate written authorization.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">4.</span>
                            CONTENT, RECORDING & PUBLICATION STANDARDS
                        </h3>
                        <p className="mb-4 text-gray-600">
                            All media coverage must:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Respect MWINTL’s institutional image and professional environment</li>
                            <li>Reflect accuracy, cultural respect, and responsible reporting</li>
                            <li>Adhere to all recording and publication restrictions</li>
                            <li>Follow MWINTL instructions regarding embargoes, schedules, and approved content</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">5.</span>
                            BRAND INTEGRITY & PROFESSIONAL CONDUCT
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Accredited media representatives are expected to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Conduct themselves with professionalism and respect</li>
                            <li>Protect confidential and non-public information</li>
                            <li>Refrain from defamatory, misleading, or damaging commentary</li>
                            <li>Avoid speculative or unauthorized narratives</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            Any conduct that may compromise MWINTL’s reputation, participants, partners, or institutional standing may result in immediate enforcement action.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">6.</span>
                            OFFICIAL PRESS RELEASES & COMMUNICATIONS
                        </h3>
                        <p className="mb-4 text-gray-600">
                            MWINTL maintains structured communication channels to ensure accurate and timely information.
                            Accredited media are encouraged to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Stay connected to MWINTL’s official press releases</li>
                            <li>Follow MWINTL announcements regarding upcoming events, designers, participants, and philanthropic initiatives</li>
                            <li>Coordinate interviews and features through MWINTL’s press office</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            Only information released through MWINTL’s official channels is considered verified and authorized.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">7.</span>
                            ENFORCEMENT & REVOCATION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            MWINTL reserves the unrestricted right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Revoke media credentials</li>
                            <li>Restrict access</li>
                            <li>Require removal of unauthorized content</li>
                            <li>Pursue legal remedies where necessary</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            All decisions regarding media accreditation and conduct are made solely at MWINTL’s discretion.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">8.</span>
                            PRESS RELATIONS & CONTACT
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Media representatives wishing to apply, collaborate, or receive official updates are invited to contact MWINTL’s press office:
                        </p>
                        <p className="mb-4 text-gray-600">
                            Accredited press will receive information regarding upcoming events, official announcements, designer features, and institutional developments.
                        </p>
                        <div className="bg-gray-100 p-6 rounded-lg">
                            <p className="font-bold text-[#C7913E] mb-2">Contact:</p>
                            <p className="text-gray-800 mb-1">info@modaweekinternational.com</p>
                            <a href="http://www.modaweekinternational.com/press" className="text-gray-800 underline hover:text-[#C7913E]">www.modaweekinternational.com/press</a>
                        </div>
                    </section>

                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <h2 className="text-2xl font-serif font-bold text-[#C7913E] tracking-wider mb-2">FINAL MEDIA STATEMENT</h2>
                    <p className="text-gray-600 mb-2">
                        Moda Week International values the role of the press in celebrating creativity, culture, and global dialogue.
                    </p>
                    <p className="text-gray-600 mb-2">
                        We welcome media professionals who approach our platform with respect, professionalism, and institutional awareness, and we look forward to building enduring relationships that honor the excellence of our global community.
                    </p>
                    <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mt-4">
                        Moda Week International
                    </p>
                    <p className="text-gray-500 uppercase tracking-widest text-xs">
                        Global Fashion. Institutional Voice. International Presence.
                    </p>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default MediaReleasePolicy;
