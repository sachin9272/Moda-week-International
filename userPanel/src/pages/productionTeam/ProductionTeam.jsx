import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Search, X } from "lucide-react";
import axios from "axios";
import { baseURL } from "../../config/api";

export default function ProductionTeam() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [availableCountries, setAvailableCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    const heroContent = {
        title: "MEET THE PRODUCTION TEAM",
        description: "The visionary professionals behind the scenes of Moda Week International. From creative direction to technical execution, our production team brings extraordinary concepts to life with precision and passion."
    };

    // Fetch available countries
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const countriesRes = await axios.get(`${baseURL}/api/production-team/countries`);
                setAvailableCountries(countriesRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchFilters();
    }, []);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchMembers = async (pageNum = 1, search = "", country = "") => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            console.log(`Fetching production team page: ${pageNum}, search: "${search}", country: "${country}"`);

            const response = await axios.get(`${baseURL}/api/production-team?page=${pageNum}&limit=12&search=${encodeURIComponent(search)}&country=${encodeURIComponent(country)}`);

            const { members: newMembers, totalPages } = response.data;

            if (pageNum === 1) {
                setMembers(newMembers || []);
            } else {
                setMembers(prev => [...prev, ...(newMembers || [])]);
            }

            setHasMore(pageNum < totalPages);
            setLoading(false);
            setLoadingMore(false);
        } catch (error) {
            console.error("Error fetching production team:", error);
            setError(error.message);
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Fetch when debounced search changes
    useEffect(() => {
        setPage(1);
        const country = activeFilter === "Country" ? selectedCountry : "";
        setMembers([]);

        fetchMembers(1, debouncedSearch, country || "");
    }, [debouncedSearch]);

    const handleFilterChange = (filter) => {
        if (filter === "All") {
            setActiveFilter("All");
            setActiveModal(null);
            setSelectedCountry(null);
            setPage(1);
            fetchMembers(1, debouncedSearch, "");
        } else if (filter === "Country") {
            setActiveModal("Country");
        }
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setActiveFilter("Country");
        setActiveModal(null);
        setPage(1);
        fetchMembers(1, debouncedSearch, country);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        const country = activeFilter === "Country" ? selectedCountry : "";
        fetchMembers(nextPage, debouncedSearch, country || "");
    };

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <div className="h-auto md:h-[450px] w-full bg-gradient-to-b from-[#C7913E] to-white flex items-center justify-center py-10 md:py-0 px-4 md:px-6">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-16 items-center px-6 md:px-16">
                    <div className="flex flex-col gap-2 text-center md:text-left mt-14 md:mt-0">
                        <h2 className="text-3xl md:text-[44px] font-bold grad-text leading-tight uppercase">
                            {heroContent.title}
                        </h2>
                    </div>
                    <div>
                        <p className="text-[14px] md:text-[18px] text-black leading-7 text-start md:text-justify mt-6 md:mt-10 whitespace-pre-line">
                            {heroContent.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="container mx-auto px-6 py-12 border-t mt-4 border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-3 relative">
                        {["All", "Country"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => handleFilterChange(filter)}
                                className={`px-3 md:px-6 py-2 rounded-full text-sm font-medium border transition-colors ${activeFilter === filter
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-64 mt-4 md:mt-0">
                        <input
                            type="text"
                            placeholder="Search team member..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-[#C7913E]"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-scaleIn">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold uppercase tracking-widest text-[#C7913E]">
                                Select {activeModal}
                            </h3>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/50">
                            <div className="flex flex-wrap gap-3">
                                {activeModal === "Country" && (
                                    availableCountries.length > 0 ? (
                                        availableCountries.map((country) => (
                                            <button
                                                key={country}
                                                onClick={() => handleCountrySelect(country)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:scale-105 ${selectedCountry === country
                                                    ? "bg-[#C7913E] text-white border-[#C7913E] shadow-lg"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-[#C7913E] hover:text-[#C7913E]"
                                                    }`}
                                            >
                                                {country}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="w-full text-center py-10 text-gray-500 italic">No countries found.</div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Team Grid */}
            <div className="container mx-auto px-6 pb-20">
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading production team...</div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">Error: {error}</div>
                ) : members.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No team members found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6">
                        {members.map((member, idx) => (
                            <div
                                key={idx}
                                className="group relative flex flex-col bg-slate-50 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(199,145,62,0.15)] transition-all duration-300 border border-gray-100/10"
                            >
                                <div className="w-full pt-8 pb-4 flex justify-center bg-gray-100">
                                    <div className="w-40 h-40 flex-shrink-0 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-md">
                                        <img
                                            src={member.image?.url || member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                </div>
                                {/* Details Container */}
                                <div className="p-6 pt-2 flex flex-col items-center justify-between flex-grow bg-slate-50">
                                        <div className="flex items-center gap-2 flex-wrap justify-center mt-2">
                                            <h3 className="text-gray-900 text-md font-bold tracking-widest uppercase text-center drop-shadow-sm">
                                                {member.name}
                                            </h3>
                                            {member.countryCode && (
                                                <img
                                                    src={`https://flagcdn.com/w20/${member.countryCode.toLowerCase()}.png`}
                                                    alt={member.country}
                                                    className="w-6 h-auto"
                                                />
                                            )}
                                        </div>
                                        <span className="text-[#c58f3b] text-[10px] md:text-xs font-bold tracking-widest uppercase bg-[#c58f3b]/10 px-4 py-1 rounded-full text-center mt-3">
                                            {member.role || 'Production Team'}
                                        </span>

                                        {/* Social Icons */}
                                        <div className="flex items-center gap-4 mt-2">
                                            {member.instagram && (
                                                <a
                                                    href={member.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-[#c58f3b] transition-colors"
                                                    title="Instagram"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                                </a>
                                            )}
                                            {member.website && (
                                                <a
                                                    href={member.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-[#c58f3b] transition-colors"
                                                    title="Website"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                                </a>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => setSelectedMember(member)}
                                            className="w-full max-w-[200px] mt-6 bg-[#c58f3b] text-white px-5 py-3 text-sm font-bold tracking-widest uppercase hover:bg-[#a6762c] transition-colors rounded-full shadow-md"
                                        >
                                            Show More
                                        </button>
                                    </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More */}
                {hasMore && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="bg-black text-white px-8 py-3 text-sm tracking-widest hover:bg-[#C7913E] transition-colors duration-300 uppercase disabled:opacity-50 font-medium"
                        >
                            {loadingMore ? "LOADING..." : "LOAD MORE"}
                        </button>
                    </div>
                )}
            </div>

            {/* Member Detail Modal */}
            {selectedMember && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 md:p-8 animate-fadeIn" onClick={() => setSelectedMember(null)}>
                    <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative shadow-[0_0_40px_rgba(0,0,0,0.3)] animate-scaleIn rounded-sm" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-4 right-4 z-[70] p-2 bg-black/10 hover:bg-black hover:text-white rounded-full transition-colors text-black"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-5/12 relative p-6 md:p-10 flex items-center justify-center bg-[#eaeaea] overflow-hidden">
                            {/* Decorative Line inspired by design user provided */}
                            <div className="absolute left-0 md:left-4 top-1/4 bottom-1/4 w-[3px] bg-[#C7913E]"></div>
                            
                            {/* The vertical dashed line next to image */}
                            <div className="absolute right-0 top-0 bottom-0 w-[1px] border-r border-dashed border-gray-400"></div>

                            <img
                                src={selectedMember.image?.url || selectedMember.image}
                                alt={selectedMember.name}
                                className="w-full h-auto object-cover max-h-[50vh] md:max-h-[70vh] shadow-xl z-10"
                            />
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col bg-white relative">
                            {/* Decorative right dashed line */}
                            <div className="absolute right-6 top-0 bottom-0 w-[1px] hidden xl:block"></div>

                            <h2 className="text-3xl md:text-5xl font-serif text-[#C7913E] mb-2 leading-tight">
                                {selectedMember.name}
                            </h2>
                            <p className="text-sm md:text-base text-gray-500 mb-6 pb-6">
                                {selectedMember.role}
                            </p>
                            
                            <div className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line overflow-y-auto pr-4 custom-scrollbar font-light">
                                {selectedMember.description || "No detailed description available for this member yet."}
                            </div>

                            {/* Social Links */}
                            <div className="mt-auto pt-8 flex gap-4">
                                {selectedMember.instagram && (
                                    <a href={selectedMember.instagram} target="_blank" rel="noopener noreferrer" className="text-[#C7913E] hover:text-black transition-colors font-medium flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                        Instagram
                                    </a>
                                )}
                                {selectedMember.website && (
                                    <a href={selectedMember.website} target="_blank" rel="noopener noreferrer" className="text-[#C7913E] hover:text-black transition-colors font-medium flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                        Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
