// src/pages/NewsDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/admin/news/get/${id}`);
        setArticle(res.data.data);
      } catch (err) {
        setError('Article not found or failed to load.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the article you're looking for."}</p>
          <button
            onClick={() => navigate('/dashboard/news')}
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Back Button */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-all font-medium group"
          >
            <ArrowLeft size={20} />
            <span>Back to Articles</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Category */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              <Tag size={14} />
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            {article.title}
          </h1>

          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {article.author ? article.author.split(' ').map(n => n[0]).join('').slice(0, 2) : 'A'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{article.author || 'Anonymous'}</p>
                <p className="text-sm">Author</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              {/* <span>{format(new Date(article?.date), 'MMMM d, yyyy')}</span> */}
            </div>
          </div>

          {/* Featured Image */}
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-96 md:h-[500px] object-cover rounded-2xl mb-12 shadow-2xl"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=No+Image";
              }}
            />
          ) : (
            <div className="w-full h-96 md:h-[500px] bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-12 shadow-xl">
              <div className="text-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-2xl">
                  <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xl font-semibold text-gray-700">Featured Image</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-12 pb-20">
        <div
          className="prose prose-lg max-w-none
                     prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-12
                     prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg
                     prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 prose-blockquote:pl-8 prose-blockquote:py-4 prose-blockquote:bg-indigo-50/50 prose-blockquote:rounded-r-xl
                     prose-ul:list-disc prose-ul:pl-8 prose-ol:list-decimal prose-ol:pl-8
                     prose-li:text-gray-700 prose-li:my-3 prose-li:text-base
                     prose-a:text-indigo-600 prose-a:underline hover:prose-a:text-indigo-700 prose-a:font-medium
                     prose-strong:font-bold prose-strong:text-gray-900
                     prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10
                     prose-hr:border-t-4 prose-hr:border-indigo-200 prose-hr:my-16"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {/* Bottom CTA */}
      <div className="bg-linear-to-t from-gray-100 to-transparent">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Stay in the Know
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
            Get exclusive insights and breaking stories delivered to your inbox weekly.
          </p>
          <button className="bg-linear-to-r from-indigo-600 to-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;