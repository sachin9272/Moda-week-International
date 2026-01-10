import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Search } from "lucide-react";

// Placeholder images - using available assets where possible or placeholders
// Placeholder images - using available assets where possible or placeholders

// Using a mix of imported and placeholder images for the grid
import axios from "axios";
import { baseURL } from "../../config/api";

export default function FashionDesigners() {
    const [activeCategory, setActiveCategory] = useState("Designer"); // 'Designer' or 'Student'
    const [activeFilter, setActiveFilter] = useState("All");
    const [designers, setDesigners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [error, setError] = useState(null);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [availableCountries, setAvailableCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);

    const [activeModal, setActiveModal] = useState(null);

    // Fetch available countries and events
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [countriesRes, eventsRes] = await Promise.all([
                    axios.get(`${baseURL}/api/fashion-designers/countries`),
                    axios.get(`${baseURL}/api/events/all`) // Ensure this endpoint exists
                ]);
                setAvailableCountries(countriesRes.data);
                setEvents(eventsRes.data);
            } catch (error) {
                console.error("Error fetching filters:", error);
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

    const fetchDesigners = async (pageNum = 1, search = "", country = "") => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            console.log(`Fetching designers page: ${pageNum}, search: "${search}", country: "${country}", category: "${activeCategory}"`);
            // We need to pass category to backend. Note: Backend currently doesn't implement 'category' filter in `getDesigners` list API.
            // Assuming we will rely on client side filtering FOR NOW if the list is small enough, OR we need to update backend to filter.
            // BUT since this is paginated, client side filtering is buggy (page 1 might have 0 students).
            // So we MUST pass category to backend. I will add `category=${activeCategory}` query param.
            // I need to update backend controller to handle this param.
            const response = await axios.get(`${baseURL}/api/fashion-designers?page=${pageNum}&limit=12&search=${encodeURIComponent(search)}&country=${encodeURIComponent(country)}&category=${encodeURIComponent(activeCategory)}`);

            console.log("Full Response Data:", response.data);
            const { designers: newDesigners, totalPages } = response.data;

            if (!Array.isArray(newDesigners)) {
                console.error("newDesigners is not an array:", newDesigners);
                setLoading(false);
                return;
            }

            if (pageNum === 1) {
                setDesigners(newDesigners);
            } else {
                setDesigners(prev => [...prev, ...newDesigners]);
            }

            setHasMore(pageNum < totalPages);
            setLoading(false);
            setLoadingMore(false);
        } catch (error) {
            console.error("Error fetching designers:", error);
            setError(error.message);
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Filter designers locally based on activeCategory
    const filteredDesigners = designers.filter(designer => {
        const designerCategory = designer.category || 'Designer'; // Default to Designer
        return designerCategory === activeCategory;
    });

    const fetchEventDesigners = async (eventId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/events/${eventId}`);
            const event = response.data;

            // Extract unique designer IDs
            const designerIds = new Set();
            if (event.collections) {
                event.collections.forEach(col => {
                    if (col.designerId) {
                        designerIds.add(col.designerId);
                    }
                });
            }

            if (designerIds.size === 0) {
                setDesigners([]);
                setLoading(false);
                return;
            }

            // Fetch full details for each designer
            const designerPromises = Array.from(designerIds).map(id =>
                axios.get(`${baseURL}/api/fashion-designers/${id}`)
                    .then(res => res.data)
                    .catch(err => {
                        console.error(`Failed to fetch designer ${id}:`, err);
                        return null;
                    })
            );

            const fetchedDesigners = await Promise.all(designerPromises);

            // Filter out nulls (failed fetches)
            const validDesigners = fetchedDesigners.filter(d => d !== null);

            setDesigners(validDesigners);
            setHasMore(false);
        } catch (err) {
            console.error("Error fetching event designers:", err);
            setError("Failed to load event designers");
        } finally {
            setLoading(false);
        }
    };

    // Fetch when debounced search or activeCategory changes
    useEffect(() => {
        setPage(1);
        // Keep selected country if active filter is Country, otherwise reset
        const country = activeFilter === "Country" ? selectedCountry : "";
        // Reset list when category changes to clear mixed results
        setDesigners([]);
        fetchDesigners(1, debouncedSearch, country || "");
    }, [debouncedSearch, activeCategory]);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        // Effects will trigger fetch
    };

    const handleFilterChange = (filter) => {
        if (filter === "All") {
            setActiveFilter("All");
            setActiveModal(null);
            setSelectedCountry(null);
            setSelectedEventId(null);
            setPage(1);
            fetchDesigners(1, debouncedSearch, "");
        } else if (filter === "Country") {
            setActiveModal("Country");
        } else if (filter === "Event") {
            setActiveModal("Event");
        }
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setActiveFilter("Country");
        setActiveModal(null);
        setPage(1);
        fetchDesigners(1, debouncedSearch, country);
    };

    const handleEventSelect = (eventId) => {
        setSelectedEventId(eventId);
        setActiveFilter("Event");
        setActiveModal(null);
        setPage(1);
        fetchEventDesigners(eventId);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        const country = activeFilter === "Country" ? selectedCountry : "";
        fetchDesigners(nextPage, debouncedSearch, country || "");
    };

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <div className="h-auto md:h-[450px] w-full bg-gradient-to-b from-[#C7913E] to-white flex items-center justify-center py-10 md:py-0 px-6">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center px-16">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl md:text-[44px] font-bold grad-text leading-tight uppercase">
                            MEET THE VISIONARY <br /> FASHION DESIGNERS
                        </h2>
                    </div>
                    <div>
                        <p className="text-[14px] md:text-[18px] text-black leading-7 text-justify mt-10">
                            Members of Moda Week International’s platform, our fashion designers play a vital role for the future of the fashion industry. Their contributions extend beyond showcasing their talents and business acumen. Their commitment is entrusted with the responsibility and influencing the strategic direction that will define the industry.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="container mx-auto px-6 py-12">
                {/* Category Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="flex bg-gray-100 p-1 rounded-full">
                        <button
                            onClick={() => handleCategoryChange("Designer")}
                            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeCategory === "Designer"
                                ? "bg-black text-white shadow-lg"
                                : "text-gray-500 hover:text-black"
                                }`}
                        >
                            Designers
                        </button>
                        <button
                            onClick={() => handleCategoryChange("Student")}
                            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeCategory === "Student"
                                ? "bg-black text-white shadow-lg"
                                : "text-gray-500 hover:text-black"
                                }`}
                        >
                            Student Designers
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Filter Buttons */}
                    <div className="md:w-[15%] w-0"></div>
                    <div className="flex flex-wrap gap-3 relative">
                        {["All", "Country", "Event"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => handleFilterChange(filter)}
                                className={`px-3 md:px-6 rounded-full text-sm font-medium border transition-colors ${activeFilter === filter
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
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-10 py-1.5 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-[#C7913E]"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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

                                {activeModal === "Event" && (
                                    events.length > 0 ? (
                                        events.map((event) => (
                                            <button
                                                key={event._id}
                                                onClick={() => handleEventSelect(event._id)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:scale-105 ${selectedEventId === event._id
                                                    ? "bg-[#C7913E] text-white border-[#C7913E] shadow-lg"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-[#C7913E] hover:text-[#C7913E]"
                                                    }`}
                                            >
                                                {event.eventName}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="w-full text-center py-10 text-gray-500 italic">No events found.</div>
                                    )
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Designers Grid */}
            <div className="container mx-auto px-6 pb-20">
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading designers...</div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">Error: {error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6">
                        {filteredDesigners.map((designer, idx) => (
                            <div
                                key={idx}
                                className="group relative h-[300px] md:h-[400px] overflow-hidden cursor-default"
                            >
                                <div className="w-full h-full">
                                    <img
                                        src={designer.image?.url || designer.image}
                                        alt={designer.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                    {/* Overlay Gradient */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-center items-center gap-3 bg-black/60 backdrop-blur-xs h-auto min-h-[4rem] transition-all duration-300">
                                        <div className="flex items-center gap-2 flex-wrap justify-center">
                                            <h3 className="text-white text-sm font-bold tracking-widest uppercase text-center">
                                                {designer.name}
                                            </h3>
                                            {designer.countryCode && (
                                                <img
                                                    src={`https://flagcdn.com/w20/${designer.countryCode.toLowerCase()}.png`}
                                                    alt={designer.country}
                                                    className="w-6 h-auto"
                                                />
                                            )}
                                            {designer.instagram && (
                                                <a
                                                    href={designer.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white hover:text-[#C7913E] transition-colors ml-2"
                                                    title="Instagram"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                                </a>
                                            )}
                                            {designer.website && (
                                                <a
                                                    href={designer.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white hover:text-[#C7913E] transition-colors ml-1"
                                                    title="Website"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
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
                            className="bg-black text-white px-8 py-3 text-sm tracking-widest hover:bg-[#C7913E] transition-colors duration-300 uppercase disabled:opacity-50"
                        >
                            {loadingMore ? "LOADING..." : "LOAD MORE"}
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div >
    );
}
