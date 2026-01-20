import React, { useState, useEffect } from 'react';
import { baseURL } from '../config/api';
import Navbar from './Navbar';
import Footer from './Footer';

const LegalPageViewer = ({ pageType, defaultTitle, defaultSubtitle }) => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await fetch(`${baseURL}/api/legal-pages/${pageType}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.content) {
                        setPageData(data);
                    }
                }
            } catch (error) {
                console.error(`Error fetching ${pageType}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [pageType]);

    // If loading or no data from API, we can either show a loader or (if we had it) fallback content.
    // Since we're replacing hardcoded files, we'll assume the API should drive this.
    // If API returns nothing, we show a default empty state or the passed default title.

    const title = pageData?.title || defaultTitle;
    const content = pageData?.content;

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#C7913E] to-white py-20 px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold grad-text leading-tight uppercase mb-4">
                        {title}
                    </h1>
                    {defaultSubtitle && (
                        <p className="text-lg md:text-xl font-medium text-slate-800 tracking-wide uppercase">
                            {defaultSubtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C7913E]"></div>
                    </div>
                ) : content ? (
                    <div
                        className="rich-text-content text-gray-800 text-lg leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ) : (
                    <div className="text-center p-12 text-gray-500">
                        <p>Content is being updated. Please check back soon.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default LegalPageViewer;
