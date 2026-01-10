import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CodeOfConduct = () => {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#C7913E] to-white py-20 px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold grad-text leading-tight uppercase mb-4">
                        CODE OF CONDUCT
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-slate-800 tracking-wide uppercase">
                        PREAMBLE | INSTITUTIONAL STANDARD
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 container mx-auto px-6 py-12 max-w-4xl">

                {/* Intro */}
                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-xl mb-12 shadow-sm">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                        Moda Week International (MWINTL) operates as a high-level international fashion, culture, and philanthropic platform. Our productions, memberships, and partnerships are founded on professional excellence, discretion, ethical conduct, and institutional respect.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                        This Code of Conduct establishes the mandatory behavioral standards governing all production teams and clientele engaged with MWINTL.
                    </p>
                    <p className="text-gray-700 leading-relaxed font-semibold text-sm md:text-base">
                        Compliance is not optional. Participation is a privilege, not a right.
                    </p>
                </div>

                <div className="space-y-12 text-gray-800">
                    {/* Section 1 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">1.</span>
                            SCOPE OF APPLICATION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            This Code applies to, without limitation:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Executive and production teams</li>
                            <li>Event staff, coordinators, and contractors</li>
                            <li>Designers, stylists, creatives, and technical crews</li>
                            <li>Clients, members, patrons, sponsors, and invited guests</li>
                            <li>Consultants, vendors, and affiliated representatives</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            Any individual acting under MWINTL’s name, within MWINTL environments, or in connection with MWINTL projects is bound by this Code.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">2.</span>
                            CORE PRINCIPLES
                        </h3>
                        <p className="mb-4 text-gray-600">
                            All MWINTL production teams and clientele must uphold the following principles at all times:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li><strong>Professionalism:</strong> Conduct reflecting competence, responsibility, and respect</li>
                            <li><strong>Discretion:</strong> Protection of private, proprietary, and sensitive matters</li>
                            <li><strong>Integrity:</strong> Ethical, and transparent conduct</li>
                            <li><strong>Respect:</strong> Dignity toward all cultures, roles, and institutions</li>
                            <li><strong>Institutional Loyalty:</strong> Actions that protect and elevate MWINTL’s reputation</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">3.</span>
                            PROFESSIONAL CONDUCT & WORKPLACE STANDARDS
                        </h3>
                        <p className="mb-4 text-gray-600">
                            All individuals are required to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Perform their duties with diligence, punctuality, and accountability</li>
                            <li>Follow all MWINTL protocols, instructions, and operational procedures</li>
                            <li>Maintain respectful, non-abusive, and non-disruptive behavior</li>
                            <li>Refrain from conflicts, power abuse, intimidation, or inappropriate conduct</li>
                            <li>Respect hierarchical structures, leadership decisions, and production authority</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            Unprofessional behavior, disorderly conduct, or insubordination will not be tolerated.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">4.</span>
                            CONFIDENTIALITY & DISCRETION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Production teams and clientele must:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Treat all non-public information as strictly confidential</li>
                            <li>Protect discussions, documents, creative material, internal processes, and private interactions</li>
                            <li>Refrain from sharing information with unauthorized parties</li>
                            <li>Observe discretion regarding philanthropic, financial, and strategic matters</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            Confidentiality obligations apply before, during, and after all MWINTL engagements.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">5.</span>
                            BRAND PROTECTION & NON-DISPARAGEMENT
                        </h3>
                        <p className="mb-4 text-gray-600">
                            All conduct must protect the reputation, dignity, and institutional standing of MWINTL.
                            Individuals are strictly prohibited from:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Making negative, misleading, defamatory, or harmful statements about MWINTL</li>
                            <li>Publicly criticizing MWINTL decisions, productions, leadership, or affiliates</li>
                            <li>Creating narratives, commentary, or content that may damage MWINTL’s image</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            This applies to all communication environments, including private and public channels.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">6.</span>
                            ETHICAL & CULTURAL RESPONSIBILITY
                        </h3>
                        <p className="mb-4 text-gray-600">
                            MWINTL requires conduct that reflects:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Respect for cultural diversity and international representation</li>
                            <li>Zero tolerance for harassment, discrimination, or exploitation</li>
                            <li>Ethical collaboration with communities, partners, and institutions</li>
                            <li>Responsible conduct aligned with MWINTL’s philanthropic mission</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            Any conduct that creates reputational risk may result in immediate action.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">7.</span>
                            CONFLICT OF INTEREST & REPRESENTATION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Production teams and clientele must:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>Avoid conflicts between personal interests and MWINTL responsibilities</li>
                            <li>Disclose potential conflicts immediately</li>
                            <li>Refrain from claiming authority to speak for or represent MWINTL</li>
                            <li>Never negotiate, promise, or commit on behalf of MWINTL without written authorization</li>
                        </ul>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">8.</span>
                            REPORTING & PRIVATE RESOLUTION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Any concerns, issues, or disputes must be addressed privately and professionally through MWINTL’s official channels.
                            Public escalation, online commentary, or third-party narratives are strictly prohibited. MWINTL retains sole discretion over review and resolution.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">9.</span>
                            ENFORCEMENT & DISCIPLINARY ACTION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Violations of this Code may result in immediate measures, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                            <li>Removal from production or events</li>
                            <li>Termination of contracts, roles, or participation</li>
                            <li>Revocation of access, credentials, or membership</li>
                            <li>Permanent exclusion from MWINTL projects</li>
                            <li>Legal and financial consequences</li>
                        </ul>
                        <p className="text-gray-600 font-medium">
                            No warning is required.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-baseline">
                            <span className="text-[#C7913E] mr-3">10.</span>
                            ACKNOWLEDGMENT & CONTINUING OBLIGATION
                        </h3>
                        <p className="mb-4 text-gray-600">
                            All production team members and clientele acknowledge that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>Compliance with this Code is mandatory</li>
                            <li>Obligations continue beyond project completion</li>
                            <li>MWINTL retains full authority to interpret and enforce this Code</li>
                        </ul>
                    </section>

                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <h2 className="text-2xl font-serif font-bold text-[#C7913E] tracking-wider mb-2">FINAL DECLARATION</h2>
                    <p className="text-gray-600 mb-2">
                        All production teams and clientele are expected to serve as representatives of excellence, discretion, and trust.
                    </p>
                    <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mt-4">
                        Moda Week International
                    </p>
                    <p className="text-gray-500 uppercase tracking-widest text-xs">
                        Global Fashion. Institutional Standards. Professional Integrity.
                    </p>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default CodeOfConduct;
