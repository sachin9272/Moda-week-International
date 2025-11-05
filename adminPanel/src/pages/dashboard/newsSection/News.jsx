import React, { useState } from 'react';
import { Search, Plus, X, Calendar, Tag } from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';

const News = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([
        {
            id: 1,
            title: 'Latest Fashion Trends for 2025',
            content: 'Discover the hottest fashion trends that are taking the runway by storm this season.',
            category: 'Fashion',
            date: '2025-11-01',
            image: null
        },
        {
            id: 2,
            title: 'Tech Innovation: AI Breakthrough',
            content: 'Revolutionary AI technology promises to transform how we work and live in the coming years.',
            category: 'Technology',
            date: '2025-11-02',
            image: null
        },
        {
            id: 3,
            title: 'Business Leaders Summit 2025',
            content: 'Top entrepreneurs gather to discuss the future of global business and economic trends.',
            category: 'Business',
            date: '2025-11-03',
            image: null
        },
        {
            id: 4,
            title: 'Lifestyle: Wellness Tips',
            content: 'Expert advice on maintaining a healthy work-life balance in today\'s fast-paced world.',
            category: 'Lifestyle',
            date: '2025-11-04',
            image: null
        },
        {
            id: 5,
            title: 'Entertainment Industry Updates',
            content: 'Latest news from Hollywood and the global entertainment scene.',
            category: 'Entertainment',
            date: '2025-11-05',
            image: null
        }
    ]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const categories = ['Fashion', 'Lifestyle', 'Business', 'Technology', 'Entertainment'];

    // Filter and search logic
    const filteredNews = news.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNews = filteredNews.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">News Management</h1>
                    <p className="text-gray-600">Manage and browse all news articles</p>
                </div>

                {/* Controls Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-3 items-center w-full md:w-auto">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            {/* Add News Button */}
                            <button
                                onClick={() => navigate('/dashboard/news-add')}
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add News</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-gray-600">
                        Showing {currentNews.length} of {filteredNews.length} articles
                    </p>
                </div>

                {/* News Grid */}
                {currentNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {currentNews.map(item => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                                {item.image ? (
                                    <img
                                        src={URL.createObjectURL(item.image)}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        <span className="text-gray-400 text-lg">No Image</span>
                                    </div>
                                )}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                            <Tag className="w-3 h-3" />
                                            {item.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(item.date).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg">
                        <p className="text-gray-500 text-lg">No articles found matching your criteria</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        
                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`w-10 h-10 rounded-lg font-medium ${
                                        currentPage === index + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
                <Outlet />
            </div>
        </div>
    );
};

export default News;